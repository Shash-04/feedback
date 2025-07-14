-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "placementCommunication" TEXT NOT NULL,
    "mockInterviewsHelpful" TEXT NOT NULL,
    "companyInteractionFeedback" TEXT NOT NULL,
    "trainingRelevance" TEXT NOT NULL,
    "coordinationRating" TEXT NOT NULL,
    "mockImprovement" TEXT NOT NULL,
    "suggestions" TEXT NOT NULL,
    "wishlistCompanies" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);
