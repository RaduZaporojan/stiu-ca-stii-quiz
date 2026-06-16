"use server";

import {
  completeNormalRound,
  getCategoryOptions,
  getCorrectAnswerId,
  prepareFinalRound,
  prepareNormalRound,
} from "@/lib/game-session";
import {
  grantPermanentHeartReward,
  handleFinalAnswer,
  handleNormalAnswer,
  recordGameLoss,
} from "@/lib/scoring";

export async function getCategoryOptionsAction(sessionId?: string) {
  return getCategoryOptions(6, sessionId);
}

export async function prepareNormalRoundAction(
  sessionId: string,
  categoryId: string,
  roundNumber: number,
) {
  return prepareNormalRound(sessionId, categoryId, roundNumber);
}

export async function prepareFinalRoundAction(sessionId: string) {
  return prepareFinalRound(sessionId);
}

export async function completeNormalRoundAction(
  sessionId: string,
  roundNumber: number,
) {
  return completeNormalRound(sessionId, roundNumber);
}

export async function submitNormalAnswerAction(
  sessionId: string,
  questionId: string,
  selectedAnswerId: string | null,
  responseTimeMs?: number,
) {
  const result = await handleNormalAnswer(
    sessionId,
    questionId,
    selectedAnswerId,
    responseTimeMs,
  );
  const correctAnswerId = await getCorrectAnswerId(questionId);

  return {
    ...result,
    correctAnswerId,
  };
}

export async function submitFinalAnswerAction(
  sessionId: string,
  questionId: string,
  selectedAnswerId: string | null,
  responseTimeMs?: number,
) {
  const result = await handleFinalAnswer(
    sessionId,
    questionId,
    selectedAnswerId,
    responseTimeMs,
  );
  const correctAnswerId = await getCorrectAnswerId(questionId);

  if (result.status === "won") {
    await grantPermanentHeartReward(sessionId);
  }

  if (result.status === "lost") {
    await recordGameLoss(sessionId);
  }

  return {
    ...result,
    correctAnswerId,
  };
}
