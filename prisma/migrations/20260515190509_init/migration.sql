-- CreateEnum
CREATE TYPE "HeartColor" AS ENUM ('orange', 'blue');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('in_progress', 'won', 'lost', 'abandoned');

-- CreateEnum
CREATE TYPE "GamePhase" AS ENUM ('normal', 'final', 'result');

-- CreateEnum
CREATE TYPE "SessionQuestionPhase" AS ENUM ('normal', 'final');

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "heartColor" "HeartColor" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaderboardEntry" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "totalPermanentHearts" INTEGER NOT NULL DEFAULT 0,
    "gamesWon" INTEGER NOT NULL DEFAULT 0,
    "gamesLost" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaderboardEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "accentColor" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "imageUrl" TEXT,
    "difficultyLevel" INTEGER NOT NULL DEFAULT 1,
    "explanation" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "canAppearInNormalRounds" BOOLEAN NOT NULL DEFAULT true,
    "canAppearInFinalRound" BOOLEAN NOT NULL DEFAULT false,
    "finalRoundWeight" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSession" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "heartColor" "HeartColor" NOT NULL,
    "status" "GameStatus" NOT NULL DEFAULT 'in_progress',
    "currentPhase" "GamePhase" NOT NULL DEFAULT 'normal',
    "temporaryHearts" INTEGER NOT NULL DEFAULT 0,
    "heartsEarnedNormal" INTEGER NOT NULL DEFAULT 0,
    "normalRoundsCompleted" INTEGER NOT NULL DEFAULT 0,
    "finalQuestionsCompleted" INTEGER NOT NULL DEFAULT 0,
    "rewardGranted" BOOLEAN NOT NULL DEFAULT false,
    "lossRecorded" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSessionQuestion" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "phase" "SessionQuestionPhase" NOT NULL,
    "roundNumber" INTEGER,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameSessionQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameAnswer" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedAnswerId" TEXT,
    "isCorrect" BOOLEAN NOT NULL,
    "responseTimeMs" INTEGER,
    "phase" "SessionQuestionPhase" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_nickname_key" ON "Player"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_playerId_key" ON "LeaderboardEntry"("playerId");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_totalPermanentHearts_updatedAt_idx" ON "LeaderboardEntry"("totalPermanentHearts", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_isActive_order_idx" ON "Category"("isActive", "order");

-- CreateIndex
CREATE INDEX "Question_categoryId_isActive_difficultyLevel_idx" ON "Question"("categoryId", "isActive", "difficultyLevel");

-- CreateIndex
CREATE INDEX "Question_isActive_canAppearInFinalRound_difficultyLevel_idx" ON "Question"("isActive", "canAppearInFinalRound", "difficultyLevel");

-- CreateIndex
CREATE INDEX "Answer_questionId_idx" ON "Answer"("questionId");

-- CreateIndex
CREATE INDEX "GameSession_playerId_status_startedAt_idx" ON "GameSession"("playerId", "status", "startedAt");

-- CreateIndex
CREATE INDEX "GameSessionQuestion_sessionId_phase_roundNumber_orderIndex_idx" ON "GameSessionQuestion"("sessionId", "phase", "roundNumber", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "GameSessionQuestion_sessionId_questionId_key" ON "GameSessionQuestion"("sessionId", "questionId");

-- CreateIndex
CREATE INDEX "GameAnswer_sessionId_phase_createdAt_idx" ON "GameAnswer"("sessionId", "phase", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "GameAnswer_sessionId_questionId_key" ON "GameAnswer"("sessionId", "questionId");

-- AddForeignKey
ALTER TABLE "LeaderboardEntry" ADD CONSTRAINT "LeaderboardEntry_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSessionQuestion" ADD CONSTRAINT "GameSessionQuestion_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "GameSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSessionQuestion" ADD CONSTRAINT "GameSessionQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAnswer" ADD CONSTRAINT "GameAnswer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "GameSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAnswer" ADD CONSTRAINT "GameAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
