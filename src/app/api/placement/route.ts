import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const data = await req.json();

        const {
            studentName,
            studentId,
            department,
            placementCommunication,
            trainingRelevance,
            mockInterviewsHelpful,
            coordinationRating,
            suggestions,
            wishlistCompanies,
        } = data;

        const createdFeedback = await prisma.placementFeedback.create({
            data: {
                studentName,
                studentId,
                department,
                placementCommunication,
                trainingRelevance,
                mockInterviewsHelpful,
                coordinationRating,
                suggestions,
                wishlistCompanies,
            },
        });

        return NextResponse.json({ success: true, data: createdFeedback }, { status: 201 });
    } catch (error) {
        console.error('PlacementFeedback POST error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
