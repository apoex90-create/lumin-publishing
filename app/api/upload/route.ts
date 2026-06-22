import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

// Vercel Blob upload endpoint
// Requires BLOB_READ_WRITE_TOKEN env var

const ALLOWED_TYPES = {
  manuscript: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/rtf',
  ],
  cover: ['image/jpeg', 'image/png', 'image/webp'],
  avatar: ['image/jpeg', 'image/png', 'image/webp'],
};

const MAX_SIZE = {
  manuscript: 50 * 1024 * 1024,
  cover: 10 * 1024 * 1024,
  avatar: 5 * 1024 * 1024,
};

// Sniffs the file's actual magic bytes — the client-supplied `file.type` is
// just a header the caller can set to anything, so binary content must be
// verified server-side before it's trusted for validation or storage.
function sniffFileType(buf: Buffer): string | null {
  if (buf.length >= 4 && buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) {
    return 'application/pdf'; // %PDF
  }
  if (buf.length >= 8 && buf[0] === 0xd0 && buf[1] === 0xcf && buf[2] === 0x11 && buf[3] === 0xe0) {
    return 'application/msword'; // OLE compound file (.doc)
  }
  if (buf.length >= 4 && buf[0] === 0x50 && buf[1] === 0x4b && buf[2] === 0x03 && buf[3] === 0x04) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; // zip container (.docx)
  }
  if (buf.length >= 5 && buf.subarray(0, 5).toString('latin1') === '{\\rtf') {
    return 'application/rtf';
  }
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return 'image/jpeg';
  }
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return 'image/png';
  }
  if (buf.length >= 12 && buf.subarray(0, 4).toString('latin1') === 'RIFF' && buf.subarray(8, 12).toString('latin1') === 'WEBP') {
    return 'image/webp';
  }
  return null; // no known binary signature — may be genuine plain text
}

// text/plain has no magic bytes, so instead check the sample doesn't look like
// binary data (executables, archives, etc. mislabeled as text/plain).
function looksLikeText(sample: Buffer): boolean {
  if (sample.length === 0) return true;
  let suspicious = 0;
  for (const byte of sample) {
    if (byte === 0) {
      return false; // NUL bytes never appear in genuine text files
    }
    if (byte < 0x09 || (byte > 0x0d && byte < 0x20)) suspicious++;
  }
  return suspicious / sample.length < 0.05;
}

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();

  if (!me) {
    return NextResponse.json(
      { error: 'Not signed in' },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();

    const file = formData.get('file') as File | null;

    const kind =
      (formData.get('kind') as string) || 'manuscript';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const allowed =
      ALLOWED_TYPES[kind as keyof typeof ALLOWED_TYPES];

    if (!allowed) {
      return NextResponse.json(
        { error: 'Invalid upload kind' },
        { status: 400 }
      );
    }

    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        {
          error: `File type not allowed. Accepted: ${allowed.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const maxSize =
      MAX_SIZE[kind as keyof typeof MAX_SIZE];

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File too large. Max ${Math.round(
            maxSize / 1024 / 1024
          )}MB`,
        },
        { status: 400 }
      );
    }

    const sample = Buffer.from(await file.slice(0, 16).arrayBuffer());
    const sniffed = sniffFileType(sample);
    let verifiedType: string;

    if (kind === 'cover' || kind === 'avatar') {
      if (!sniffed || !allowed.includes(sniffed)) {
        return NextResponse.json(
          { error: 'File content does not match an allowed image format.' },
          { status: 400 }
        );
      }
      verifiedType = sniffed;
    } else if (file.type === 'text/plain') {
      if (sniffed || !looksLikeText(sample)) {
        return NextResponse.json(
          { error: 'File content does not look like plain text.' },
          { status: 400 }
        );
      }
      verifiedType = 'text/plain';
    } else {
      if (!sniffed || sniffed !== file.type) {
        return NextResponse.json(
          { error: 'File content does not match the declared file type.' },
          { status: 400 }
        );
      }
      verifiedType = sniffed;
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          error:
            'File storage not configured. Add Vercel Blob to the project.',
        },
        { status: 503 }
      );
    }

    const { put } = await import('@vercel/blob');

    const safeName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .slice(0, 80);

    const path = `${kind}/${me.id}/${Date.now()}-${safeName}`;

    const blob = await put(path, file, {
      access: 'public',
      contentType: verifiedType,
    });

    return NextResponse.json({
      url: blob.url,
      kind,
      filename: file.name,
    });
  } catch (err: any) {
    console.error('Upload error:', err);

    return NextResponse.json(
      { error: err.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
