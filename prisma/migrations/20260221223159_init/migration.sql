-- CreateTable
CREATE TABLE "SurveyResponse" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "location" TEXT,
    "profile" TEXT[],
    "cluster" TEXT[],
    "fundingNeed" TEXT,
    "fundingRange" TEXT,
    "cardInterest" TEXT,
    "timeCommitment" TEXT,
    "answers" JSONB NOT NULL,

    CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("id")
);
