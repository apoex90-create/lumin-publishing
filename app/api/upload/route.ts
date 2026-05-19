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
      contentType: file.type,
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
