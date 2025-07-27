import { NextResponse } from 'next/server';
import { PrismaClient, QuestionType } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const totalForms = await prisma.feedbackForm.count();
    const totalResponses = await prisma.feedbackResponse.count();

    // Fetch all answers to RATING questions
    const ratingAnswers = await prisma.answer.findMany({
      where: {
        question: {
          type: QuestionType.RATING,
        },
      },
      select: {
        answer: true,
      },
    });

    // Calculate average rating
    const ratings = ratingAnswers
      .map((a) => parseFloat(a.answer))
      .filter((n) => !isNaN(n));

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((acc, val) => acc + val, 0) / ratings.length
        : 0;

    // Fetch response count for each form
    const responsesPerForm = await prisma.feedbackForm.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            responses: true,
          },
        },
      },
    });

    return NextResponse.json({
      totalForms,
      totalResponses,
      averageRating: Number(averageRating.toFixed(2)),
      responsesPerForm,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error fetching stats' },
      { status: 500 }
    );
  }
}
