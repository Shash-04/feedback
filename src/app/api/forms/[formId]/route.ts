import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server"; // Import NextRequest for better type safety

const prisma = new PrismaClient();

// GET: fetch a single form by ID
export async function GET(
  req: NextRequest, // Use NextRequest for better typing of the request object
  { params }: { params: { formId: string } }
) {
  try {
    const { formId } = params; // CORRECTED: Removed await

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
}

// PUT: update form by ID
export async function PUT(
  req: NextRequest, // Use NextRequest
  { params }: { params: { formId: string } }
) {
  try {
    const { formId } = params; // CORRECTED: Removed await
    const body = await req.json();
    const { title, questions } = body;

    const updatedForm = await prisma.feedbackForm.update({
      where: { id: formId },
      data: {
        title,
        questions: {
          deleteMany: {}, // remove old questions
          create: questions.map((q: any) => ({ // Consider defining an interface for 'q' for better type safety
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
}

// DELETE: delete form by ID
export async function DELETE(
  req: NextRequest, // Use NextRequest
  { params }: { params: { formId: string } }
) {
  try {
    const { formId } = params; // CORRECTED: Removed await

    await prisma.feedbackForm.delete({
      where: { id: formId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE form error:", error);
    return NextResponse.json({ error: "Failed to delete form" }, { status: 500 });
  }
}