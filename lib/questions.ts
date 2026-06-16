import type { Prisma, Question } from "@prisma/client";
import { prisma } from "./prisma";

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function difficultyRangeForRound(roundNumber: number) {
  if (roundNumber === 1) return [1, 2];
  if (roundNumber === 2) return [2, 3];
  if (roundNumber === 3) return [3, 4];
  return [1, 5];
}

export async function getRandomActiveCategories(limit = 6) {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  return shuffle(categories).slice(0, limit);
}

export async function selectNormalRoundQuestions(
  categoryId: string,
  roundNumber: number,
  excludeQuestionIds: string[] = [],
) {
  const range = difficultyRangeForRound(roundNumber);
  const baseWhere: Prisma.QuestionWhereInput = {
    categoryId,
    isActive: true,
    canAppearInNormalRounds: true,
    id: { notIn: excludeQuestionIds },
  };

  const preferred = await prisma.question.findMany({
    where: {
      ...baseWhere,
      difficultyLevel: { in: range },
    },
    include: { answers: true },
  });

  if (preferred.length >= 5) {
    return shuffle(preferred).slice(0, 5);
  }

  const relaxed = await prisma.question.findMany({
    where: baseWhere,
    include: { answers: true },
  });

  return shuffle(relaxed).slice(0, 5);
}

export async function selectFinalRoundQuestions(excludeQuestionIds: string[] = []) {
  const questions = await prisma.question.findMany({
    where: {
      isActive: true,
      canAppearInFinalRound: true,
      id: { notIn: excludeQuestionIds },
    },
    include: { answers: true },
    orderBy: [{ difficultyLevel: "asc" }, { finalRoundWeight: "desc" }],
  });

  const selected: typeof questions = [];
  const selectedIds = new Set<string>();

  function takeUnique(pool: typeof questions, count: number) {
    const available = shuffle(pool).filter((question) => !selectedIds.has(question.id));
    for (const question of available.slice(0, count)) {
      selected.push(question);
      selectedIds.add(question.id);
    }
  }

  takeUnique(
    questions.filter((question) => question.difficultyLevel === 3),
    4,
  );
  takeUnique(
    questions.filter(
      (question) => question.difficultyLevel >= 3 && question.difficultyLevel <= 4,
    ),
    4,
  );
  takeUnique(
    questions.filter((question) => question.difficultyLevel === 4),
    4,
  );
  takeUnique(
    questions.filter((question) => question.difficultyLevel >= 4),
    4,
  );

  if (selected.length < 16) {
    takeUnique(questions, 16 - selected.length);
  }

  return selected.slice(0, 16).sort((a, b) => a.difficultyLevel - b.difficultyLevel);
}

export async function createGameSessionQuestionSet(
  sessionId: string,
  selectedQuestions: Array<{
    questionId: string;
    phase: "normal" | "final";
    roundNumber?: number | null;
    orderIndex: number;
  }>,
) {
  if (selectedQuestions.length === 0) return [];

  return prisma.gameSessionQuestion.createMany({
    data: selectedQuestions.map((question) => ({
      sessionId,
      questionId: question.questionId,
      phase: question.phase,
      roundNumber: question.roundNumber ?? null,
      orderIndex: question.orderIndex,
    })),
    skipDuplicates: true,
  });
}

export function publicQuestionPayload(question: Question & { answers: Array<{ id: string; text: string }> }) {
  return {
    id: question.id,
    text: question.text,
    imageUrl: question.imageUrl,
    difficultyLevel: question.difficultyLevel,
    answers: shuffle(question.answers).map((answer) => ({
      id: answer.id,
      text: answer.text,
    })),
  };
}
