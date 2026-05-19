import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (book.authorId !== me.id) return NextResponse.json({ error: 'Not your book' }, { status: 403 });

  if (book.isbn) return NextResponse.json({ error: 'ISBN already assigned' }, { status: 400 });
  if (book.isbnRequested) return NextResponse.json({ error: 'Application already submitted' }, { status: 400 });

  const body = await req.json();

  if (!body.publisher) return NextResponse.json({ error: 'Publisher is required' }, { status: 400 });
  if (!body.title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  if (!body.language) return NextResponse.json({ error: 'Language is required' }, { status: 400 });

  try {
    await prisma.book.update({
      where: { id },
      data: {
        title: body.title,
        language: body.language,
        publisher: body.publisher,
        publicationYear: body.publicationYear ? Number(body.publicationYear) : null,
        coAuthors: body.coAuthors || null,
        editorName: body.editorName || null,
        isbnFormat: body.isbnFormat || 'BOTH',
        isbnRequested: true,
        isbnRequestedAt: new Date(),
        isbnDeclarationAccepted: true,
      },
    });

    // Create a support thread for admin to process
    await prisma.supportThread.create({
      data: {
        subject: `ISBN Application: ${body.title}`,
        userEmail: me.email,
        status: 'open',
        messages: {
          create: {
            sender: 'system',
            body: `ISBN application submitted for book "${body.title}" by ${me.fullName}.\n\nDetails:\n- Publisher: ${body.publisher}\n- Format: ${body.isbnFormat}\n- Language: ${body.language}\n- Year: ${body.publicationYear}\n- Co-authors: ${body.coAuthors || 'None'}\n\nAdmin: please process this with RRRNA and update the ISBN field on the book record.`,
          },
        },
      },
    }).catch(() => null); // non-critical

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
