import { prisma } from "./prisma";

export async function handleNormalAnswer(
  sessionId: string,
  questionId: string,
  selectedAnswerId: string | null,
  responseTimeMs?: number,
) {
  return prisma.$transaction(async (tx) => {
    const existingAnswer = await tx.gameAnswer.findUnique({
      where: {
        sessionId_questionId: {
          sessionId,
          questionId,
        },
      },
    });

    if (existingAnswer) {
      return {
        isCorrect: existingAnswer.isCorrect,
        alreadyAnswered: true,
      };
    }

    const correctAnswer = selectedAnswerId
      ? await tx.answer.findFirst({
          where: {
            id: selectedAnswerId,
            questionId,
            isCorrect: true,
          },
        })
      : null;

    const isCorrect = Boolean(correctAnswer);

    await tx.gameAnswer.create({
      data: {
        sessionId,
        questionId,
        selectedAnswerId,
        isCorrect,
        responseTimeMs,
        phase: "normal",
      },
    });

    if (isCorrect) {
      await tx.gameSession.update({
        where: { id: sessionId },
        data: {
          temporaryHearts: { increment: 1 },
          heartsEarnedNormal: { increment: 1 },
        },
      });
    }

    return { isCorrect };
  });
}

export async function handleFinalAnswer(
  sessionId: string,
  questionId: string,
  selectedAnswerId: string | null,
  responseTimeMs?: number,
) {
  return prisma.$transaction(async (tx) => {
    const session = await tx.gameSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error("Game session not found");
    }

    if (session.status !== "in_progress") {
      return { status: session.status, isCorrect: false };
    }

    const existingAnswer = await tx.gameAnswer.findUnique({
      where: {
        sessionId_questionId: {
          sessionId,
          questionId,
        },
      },
    });

    if (existingAnswer) {
      return {
        status: session.status,
        isCorrect: existingAnswer.isCorrect,
        alreadyAnswered: true,
      };
    }

    const correctAnswer = selectedAnswerId
      ? await tx.answer.findFirst({
          where: {
            id: selectedAnswerId,
            questionId,
            isCorrect: true,
          },
        })
      : null;

    const isCorrect = Boolean(correctAnswer);

    await tx.gameAnswer.create({
      data: {
        sessionId,
        questionId,
        selectedAnswerId,
        isCorrect,
        responseTimeMs,
        phase: "final",
      },
    });

    async function markFinalQuestionCompleted(data = {}) {
      const updated = await tx.gameSession.update({
        where: { id: sessionId },
        data: {
          finalQuestionsCompleted: { increment: 1 },
          ...data,
        },
      });

      if (updated.finalQuestionsCompleted >= 16) {
        await tx.gameSession.update({
          where: { id: sessionId },
          data: {
            status: "won",
            currentPhase: "result",
            finishedAt: new Date(),
          },
        });
      }

      return updated.finalQuestionsCompleted >= 16 ? "won" : "in_progress";
    }

    if (isCorrect) {
      const status = await markFinalQuestionCompleted();

      return { isCorrect, status };
    }

    if (session.temporaryHearts > 0) {
      const status = await markFinalQuestionCompleted({
        temporaryHearts: { decrement: 1 },
      });

      return { isCorrect, status, lostHeart: true };
    }

    await tx.gameSession.update({
      where: { id: sessionId },
      data: {
        status: "lost",
        currentPhase: "result",
        finishedAt: new Date(),
      },
    });

    return { isCorrect, status: "lost", lostHeart: false };
  });
}

export async function grantPermanentHeartReward(sessionId: string) {
  return prisma.$transaction(async (tx) => {
    const session = await tx.gameSession.findUnique({
      where: { id: sessionId },
      include: { player: true },
    });

    if (!session) {
      throw new Error("Game session not found");
    }

    if (session.status !== "won" || session.rewardGranted) {
      return null;
    }

    const leaderboard = await tx.leaderboardEntry.upsert({
      where: { playerId: session.playerId },
      create: {
        playerId: session.playerId,
        totalPermanentHearts: 1,
        gamesWon: 1,
        gamesLost: 0,
      },
      update: {
        totalPermanentHearts: { increment: 1 },
        gamesWon: { increment: 1 },
      },
    });

    await tx.gameSession.update({
      where: { id: sessionId },
      data: { rewardGranted: true },
    });

    return leaderboard;
  });
}

export async function recordGameLoss(sessionId: string) {
  return prisma.$transaction(async (tx) => {
    const session = await tx.gameSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error("Game session not found");
    }

    if (session.lossRecorded) {
      return null;
    }

    const leaderboard = await tx.leaderboardEntry.upsert({
      where: { playerId: session.playerId },
      create: {
        playerId: session.playerId,
        totalPermanentHearts: 0,
        gamesWon: 0,
        gamesLost: 1,
      },
      update: {
        gamesLost: { increment: 1 },
      },
    });

    await tx.gameSession.update({
      where: { id: sessionId },
      data: { lossRecorded: true },
    });

    return leaderboard;
  });
}
