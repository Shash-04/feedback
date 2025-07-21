import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
// Define types for better type safety
interface Answer {
  questionId: string;
  responseText: string;
}

interface RequestBody {
  answers: Answer[];
}

export async function POST(req: Request, { params }: { params: { formId: string } }) {
  const { formId } = await params;

  // Validate formId
  if (!formId) {
    return NextResponse.json(
      { error: "Form ID is required" },
      { status: 400 }
    );
  }

  try {
    const { answers } = (await req.json()) as RequestBody;

    // Validate request body
    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Answers array is required and cannot be empty" },
        { status: 400 }
      );
    }

    // Validate each answer
    const invalidAnswers = answers.filter(
      (ans) => !ans.questionId || !ans.responseText
    );
    if (invalidAnswers.length > 0) {
      return NextResponse.json(
        { error: "Each answer must have questionId and responseText" },
        { status: 400 }
      );
    }

    // Create FeedbackResponse
    const response = await prisma.feedbackResponse.create({
      data: {
        form: { connect: { id: formId } },
        answers: {
          create: answers.map((ans) => ({
            answer: ans.responseText,
            question: { connect: { id: ans.questionId } },
          })),
        },
      },
      include: {
        answers: true,
      },
    });

    return NextResponse.json(
      { 
        success: true,
        message: "Feedback submitted successfully",
        data: response 
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error submitting feedback:", err);
    
    // Handle Prisma errors specifically
    if (err instanceof Error) {
      return NextResponse.json(
        { 
          error: "Failed to submit feedback",
          details: err.message 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}