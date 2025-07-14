/*
  Warnings:

  - You are about to drop the `Feedback` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Feedback";

-- CreateTable
CREATE TABLE "PlacementFeedback" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "placementCommunication" TEXT NOT NULL,
    "trainingRelevance" TEXT NOT NULL,
    "mockInterviewsHelpful" TEXT NOT NULL,
    "coordinationRating" TEXT NOT NULL,
    "suggestions" TEXT NOT NULL,
    "wishlistCompanies" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlacementFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewFeedback" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "aptitudeTestRating" TEXT NOT NULL,
    "interviewerProfessionalism" TEXT NOT NULL,
    "questionRelevance" TEXT NOT NULL,
    "briefingHelpfulness" TEXT NOT NULL,
    "confidenceRating" TEXT NOT NULL,
    "aptitudeExperience" TEXT NOT NULL,
    "interviewQuestionTypes" TEXT NOT NULL,
    "toughestPart" TEXT NOT NULL,
    "aptitudeImprovementSuggestions" TEXT NOT NULL,
    "assessmentAccuracy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyFeedback" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "technicalSkills" TEXT NOT NULL,
    "problemSolving" TEXT NOT NULL,
    "communicationSkills" TEXT NOT NULL,
    "overallSatisfaction" TEXT NOT NULL,
    "taskUnderstanding" TEXT NOT NULL,
    "adaptability" TEXT NOT NULL,
    "additionalComments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyFeedback_pkey" PRIMARY KEY ("id")
);
