import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  context: { params: { formId: string } }
) {
  try {
    const { formId } = context.params;
    const { answers } = await req.json();

    // Create a new FeedbackResponse
    const feedbackResponse = await prisma.feedbackResponse.create({
      data: {
        form: { connect: { id: formId } },
        answers: {
          create: answers.map((ans: { questionId: string; value: string }) => ({
            question: { connect: { id: ans.questionId } },
            answer: ans.value,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, responseId: feedbackResponse.id });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { error: "Something went wrong submitting the form." },
      { status: 500 }
    );
  }
}
