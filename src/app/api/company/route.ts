import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const data = await req.json();

        const {
            studentName,
            companyName,
            technicalSkills,
            problemSolving,
            communicationSkills,
            overallSatisfaction,
            taskUnderstanding,
            adaptability,
            additionalComments,
        } = data;

        const createdFeedback = await prisma.companyFeedback.create({
            data: {
                studentName,
                companyName,
                technicalSkills,
                problemSolving,
                communicationSkills,
                overallSatisfaction,
                taskUnderstanding,
                adaptability,
                additionalComments,
            },
        });

        return NextResponse.json({ success: true, data: createdFeedback }, { status: 201 });
    } catch (error) {
        console.error('CompanyFeedback POST error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
