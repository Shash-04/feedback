import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Client Payload Types
type QuestionPayload = {
  id: number;
  question: string;
  type: "DESCRIPTIVE" | "RATING";
  required: boolean;
  order: number;
};

// POST: Create a new feedback form
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, questions }: { title: string; questions: QuestionPayload[] } = body;

    if (!title || questions.length === 0) {
      return NextResponse.json({ error: "Title and questions are required" }, { status: 400 });
    }

    const form = await prisma.feedbackForm.create({
      data: {
        title,
        questions: {
          create: questions.map((q) => ({
            question: q.question,
            type: q.type,
            required: q.required,
            order: q.order
          })),
        },
      },
      include: { questions: true },
    });

    return NextResponse.json({ message: "Form created", form }, { status: 201 });
  } catch (error) {
    console.error("Form creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET: Fetch all forms with responsesCount
export async function GET() {
  try {
    const forms = await prisma.feedbackForm.findMany({
      include: {
        _count: {
          select: { responses: true }
        },
        questions: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = forms.map((form) => ({
      id: form.id,
      title: form.title,
      createdAt: form.createdAt,
      questions: form.questions,
      responsesCount: form._count.responses
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
