import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

type Shashwat = {
  params: Promise<{ formId: string }>;
};
// GET: fetch a single form by ID
export async function GET(
  req: NextRequest,
  { params }: Shashwat
) {
  try {
    const formId = (await params).formId;

    const form = await prisma.feedbackForm.findUnique({
      where: { id: formId },
      include: { questions: true },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error("GET form error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
  finally {
    await prisma.$disconnect();
  }
}

// PUT: update form by ID
export async function PUT(
  req: NextRequest,
  { params }: Shashwat
) {
  try {
    const formId = (await params).formId;
    const body = await req.json();
    const { title, questions } = body;

    const updatedForm = await prisma.feedbackForm.update({
      where: { id: formId },
      data: {
        title,
        questions: {
          deleteMany: {}, // remove old questions
          create: questions.map((q: any) => ({
            question: q.question,
            type: q.type,
            required: q.required,
            order: q.order,
          })),
        },
      },
    });

    return NextResponse.json(updatedForm);
  } catch (error) {
    console.error("PUT form error:", error);
    return NextResponse.json({ error: "Failed to update form" }, { status: 500 });
  }
  finally {
    await prisma.$disconnect();
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: Shashwat
) {
  try {
    const formId = (await params).formId;

    await prisma.feedbackForm.delete({
      where: { id: formId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE form error:", error);
    return NextResponse.json({ error: "Failed to delete form" }, { status: 500 });
  }
}