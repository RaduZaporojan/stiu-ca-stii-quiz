import type { HeartColor } from "@prisma/client";
import { prisma } from "./prisma";
import {
  createGameSessionQuestionSet,
  publicQuestionPayload,
  selectFinalRoundQuestions,
  selectNormalRoundQuestions,
} from "./questions";

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export type PublicCategory = {
  id: string;
  name: string;
};

export type PublicGameQuestion = {
  id: string;
  text: string;
  imageUrl: string | null;
  difficultyLevel: number;
  answers: Array<{ id: string; text: string }>;
};

export type PublicGameFeedback = {
  selectedAnswerId: string | null;
  correctAnswerId: string | null;
  correct: boolean;
  timedOut?: boolean;
  lostHeart?: boolean;
};

export type GameResumeSnapshot = {
  phase:
    | "choosing_category"
    | "question_active"
    | "question_answered"
    | "final_intro"
    | "won"
    | "lost";
  round: number;
  questionIndex: number;
  finalIndex: number;
  normalQuestions: PublicGameQuestion[];
  finalQuestions: PublicGameQuestion[];
  lastCategory: string;
  feedback: PublicGameFeedback | null;
};

export async function createSessionForPlayer(player: {
  id: string;
  heartColor: HeartColor;
}) {
  return prisma.gameSession.create({
    data: {
      playerId: player.id,
      heartColor: player.heartColor,
    },
  });
}

export async function getSessionForPlay(sessionId: string) {
  return prisma.gameSession.findUnique({
    where: { id: sessionId },
    include: {
      player: true,
    },
  });
}

async function questionPayloadsForSession(
  sessionId: string,
  phase: "normal" | "final",
  roundNumber?: number,
) {
  const sessionQuestionsRaw = await prisma.gameSessionQuestion.findMany({
    where: {
      sessionId,
      phase,
      ...(roundNumber ? { roundNumber } : {}),
    },
    include: {
      question: {
        include: {
          answers: {
            select: {
              id: true,
              text: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: [{ createdAt: "desc" }, { orderIndex: "asc" }],
  });
  const expectedCount = phase === "final" ? 16 : 5;
  const sessionQuestions =
    sessionQuestionsRaw.length > expectedCount
      ? sessionQuestionsRaw
          .slice(0, expectedCount)
          .sort((a, b) => a.orderIndex - b.orderIndex)
      : sessionQuestionsRaw.sort((a, b) => a.orderIndex - b.orderIndex);

  return {
    categoryName: sessionQuestions[0]?.question.category.name ?? "Categorie",
    questions: sessionQuestions.map((sessionQuestion) =>
      publicQuestionPayload(sessionQuestion.question),
    ),
  };
}

async function feedbackForAnswer(
  sessionId: string,
  questionId: string,
): Promise<PublicGameFeedback | null> {
  const answer = await prisma.gameAnswer.findUnique({
    where: {
      sessionId_questionId: {
        sessionId,
        questionId,
      },
    },
  });

  if (!answer) {
    return null;
  }

  const correctAnswerId = await getCorrectAnswerId(questionId);

  return {
    selectedAnswerId: answer.selectedAnswerId,
    correctAnswerId,
    correct: answer.isCorrect,
    timedOut: answer.selectedAnswerId === null,
  };
}

export async function getGameResumeSnapshot(
  sessionId: string,
): Promise<GameResumeSnapshot> {
  const session = await prisma.gameSession.findUnique({
    where: { id: sessionId },
    select: {
      status: true,
      currentPhase: true,
      normalRoundsCompleted: true,
      finalQuestionsCompleted: true,
    },
  });

  if (!session) {
    throw new Error("Game session not found");
  }

  if (session.status === "won" || session.status === "lost") {
    return {
      phase: session.status,
      round: 4,
      questionIndex: 0,
      finalIndex: session.finalQuestionsCompleted,
      normalQuestions: [],
      finalQuestions: [],
      lastCategory: "Runda finală",
      feedback: null,
    };
  }

  const finalRound = await questionPayloadsForSession(sessionId, "final");

  if (finalRound.questions.length > 0 || session.currentPhase === "final") {
    if (finalRound.questions.length === 0) {
      return {
        phase: "final_intro",
        round: 4,
        questionIndex: 0,
        finalIndex: 0,
        normalQuestions: [],
        finalQuestions: [],
        lastCategory: "Runda finală",
        feedback: null,
      };
    }

    const answeredFinal = await prisma.gameAnswer.findMany({
      where: {
        sessionId,
        phase: "final",
        questionId: { in: finalRound.questions.map((question) => question.id) },
      },
      orderBy: { createdAt: "asc" },
    });
    const index = Math.min(answeredFinal.length, finalRound.questions.length - 1);
    const latestAnswered = answeredFinal.at(-1);

    return {
      phase: latestAnswered ? "question_answered" : "question_active",
      round: 4,
      questionIndex: 0,
      finalIndex: latestAnswered ? Math.max(0, index) : 0,
      normalQuestions: [],
      finalQuestions: finalRound.questions,
      lastCategory: "Runda finală",
      feedback: latestAnswered
        ? await feedbackForAnswer(sessionId, latestAnswered.questionId)
        : null,
    };
  }

  const round = Math.min(session.normalRoundsCompleted + 1, 3);
  const normalRound = await questionPayloadsForSession(sessionId, "normal", round);

  if (normalRound.questions.length === 0) {
    return {
      phase: "choosing_category",
      round,
      questionIndex: 0,
      finalIndex: 0,
      normalQuestions: [],
      finalQuestions: [],
      lastCategory: "Categorie",
      feedback: null,
    };
  }

  const answeredNormal = await prisma.gameAnswer.findMany({
    where: {
      sessionId,
      phase: "normal",
      questionId: { in: normalRound.questions.map((question) => question.id) },
    },
    orderBy: { createdAt: "asc" },
  });

  if (answeredNormal.length >= normalRound.questions.length) {
    return {
      phase: round >= 3 ? "final_intro" : "choosing_category",
      round: round >= 3 ? 3 : round + 1,
      questionIndex: normalRound.questions.length - 1,
      finalIndex: 0,
      normalQuestions: [],
      finalQuestions: [],
      lastCategory: normalRound.categoryName,
      feedback: null,
    };
  }

  const latestAnswered = answeredNormal.at(-1);

  return {
    phase: latestAnswered ? "question_answered" : "question_active",
    round,
    questionIndex: latestAnswered ? answeredNormal.length - 1 : answeredNormal.length,
    finalIndex: 0,
    normalQuestions: normalRound.questions,
    finalQuestions: [],
    lastCategory: normalRound.categoryName,
    feedback: latestAnswered
      ? await feedbackForAnswer(sessionId, latestAnswered.questionId)
      : null,
  };
}

export async function getCategoryOptions(
  limit = 6,
  sessionId?: string,
): Promise<PublicCategory[]> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  if (!sessionId) {
    return shuffle(categories).slice(0, limit).map((category) => ({
      id: category.id,
      name: category.name,
    }));
  }

  const usedQuestions = await prisma.gameSessionQuestion.findMany({
    where: { sessionId },
    select: { questionId: true },
  });
  const usedQuestionIds = usedQuestions.map((question) => question.questionId);

  const round = await prisma.gameSession.findUnique({
    where: { id: sessionId },
    select: { normalRoundsCompleted: true },
  });
  const nextRound = Math.min((round?.normalRoundsCompleted ?? 0) + 1, 3);
  const difficultyRanges: Record<number, number[]> = {
    1: [1, 2],
    2: [2, 3],
    3: [3, 4],
  };
  const preferredDifficulty = difficultyRanges[nextRound] ?? [1, 2, 3, 4];
  const availableCategories = [];

  for (const category of categories) {
    const preferredCount = await prisma.question.count({
      where: {
        categoryId: category.id,
        isActive: true,
        canAppearInNormalRounds: true,
        difficultyLevel: { in: preferredDifficulty },
        id: { notIn: usedQuestionIds },
      },
    });

    const relaxedCount =
      preferredCount >= 5
        ? preferredCount
        : await prisma.question.count({
            where: {
              categoryId: category.id,
              isActive: true,
              canAppearInNormalRounds: true,
              id: { notIn: usedQuestionIds },
            },
          });

    if (relaxedCount >= 5) {
      availableCategories.push(category);
    }
  }

  return shuffle(availableCategories).slice(0, limit).map((category) => ({
    id: category.id,
    name: category.name,
  }));
}

export async function prepareNormalRound(
  sessionId: string,
  categoryId: string,
  roundNumber: number,
) {
  const existingRound = await questionPayloadsForSession(
    sessionId,
    "normal",
    roundNumber,
  );

  if (existingRound.questions.length > 0) {
    return existingRound;
  }

  const existing = await prisma.gameSessionQuestion.findMany({
    where: { sessionId },
    select: { questionId: true },
  });
  const excludeQuestionIds = existing.map((question) => question.questionId);

  const selected = await selectNormalRoundQuestions(
    categoryId,
    roundNumber,
    excludeQuestionIds,
  );

  await createGameSessionQuestionSet(
    sessionId,
    selected.map((question, index) => ({
      questionId: question.id,
      phase: "normal",
      roundNumber,
      orderIndex: index,
    })),
  );

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { name: true },
  });

  return {
    categoryName: category?.name ?? "Categorie",
    questions: selected.map(publicQuestionPayload),
  };
}

export async function prepareFinalRound(sessionId: string) {
  const existingFinal = await questionPayloadsForSession(sessionId, "final");

  if (existingFinal.questions.length > 0) {
    await prisma.gameSession.update({
      where: { id: sessionId },
      data: { currentPhase: "final" },
    });

    return existingFinal.questions;
  }

  const existing = await prisma.gameSessionQuestion.findMany({
    where: { sessionId },
    select: { questionId: true },
  });
  const excludeQuestionIds = existing.map((question) => question.questionId);

  const selected = await selectFinalRoundQuestions(excludeQuestionIds);

  await createGameSessionQuestionSet(
    sessionId,
    selected.map((question, index) => ({
      questionId: question.id,
      phase: "final",
      roundNumber: null,
      orderIndex: index,
    })),
  );

  await prisma.gameSession.update({
    where: { id: sessionId },
    data: { currentPhase: "final" },
  });

  return selected.map(publicQuestionPayload);
}

export async function completeNormalRound(
  sessionId: string,
  roundNumber: number,
) {
  return prisma.$transaction(async (tx) => {
    const session = await tx.gameSession.findUnique({
      where: { id: sessionId },
      select: { normalRoundsCompleted: true },
    });

    if (!session) {
      throw new Error("Game session not found");
    }

    if (session.normalRoundsCompleted >= roundNumber) {
      return session;
    }

    return tx.gameSession.update({
      where: { id: sessionId },
      data: {
        normalRoundsCompleted: roundNumber,
        currentPhase: roundNumber >= 3 ? "final" : "normal",
      },
      select: { normalRoundsCompleted: true },
    });
  });
}

export async function getCorrectAnswerId(questionId: string) {
  const answer = await prisma.answer.findFirst({
    where: {
      questionId,
      isCorrect: true,
    },
    select: { id: true },
  });

  return answer?.id ?? null;
}
