import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      studentName,
      studentId,
      companyName,
      aptitudeTestRating,
      interviewerProfessionalism,
      questionRelevance,
      briefingHelpfulness,
      confidenceRating,
      aptitudeExperience,
      interviewQuestionTypes,
      toughestPart,
      aptitudeImprovementSuggestions,
      assessmentAccuracy,
    } = data;

    const createdFeedback = await prisma.interviewFeedback.create({
      data: {
        studentName,
        studentId,
        companyName,
        aptitudeTestRating,
        interviewerProfessionalism,
        questionRelevance,
        briefingHelpfulness,
        confidenceRating,
        aptitudeExperience,
        interviewQuestionTypes,
        toughestPart,
        aptitudeImprovementSuggestions,
        assessmentAccuracy,
      },
    });

    return NextResponse.json({ success: true, data: createdFeedback }, { status: 201 });
  } catch (error) {
    console.error('InterviewFeedback POST error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
