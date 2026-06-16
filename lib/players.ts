import type { HeartColor } from "@prisma/client";
import { prisma } from "./prisma";

export function normalizeNickname(nickname: string) {
  return nickname.trim().replace(/\s+/g, " ");
}

export function validateNickname(nickname: string) {
  const normalized = normalizeNickname(nickname);

  if (normalized.length < 2) {
    return { ok: false as const, error: "Nickname-ul trebuie să aibă minim 2 caractere." };
  }

  if (normalized.length > 24) {
    return { ok: false as const, error: "Nickname-ul trebuie să aibă maxim 24 de caractere." };
  }

  if (!/^[\p{L}\p{N} ._-]+$/u.test(normalized)) {
    return { ok: false as const, error: "Nickname-ul conține caractere nepermise." };
  }

  return { ok: true as const, nickname: normalized };
}

export async function findPlayerByNickname(nickname: string) {
  const validated = validateNickname(nickname);
  if (!validated.ok) return null;

  return prisma.player.findUnique({
    where: { nickname: validated.nickname },
    include: { leaderboard: true },
  });
}

export async function createPlayer(nickname: string, heartColor: HeartColor) {
  const validated = validateNickname(nickname);
  if (!validated.ok) {
    throw new Error(validated.error);
  }

  return prisma.player.create({
    data: {
      nickname: validated.nickname,
      heartColor,
      leaderboard: {
        create: {
          totalPermanentHearts: 0,
          gamesWon: 0,
          gamesLost: 0,
        },
      },
    },
    include: { leaderboard: true },
  });
}

export async function getOrCreatePlayer(nickname: string, heartColor?: HeartColor) {
  const existing = await findPlayerByNickname(nickname);
  if (existing) {
    return { player: existing, isNew: false };
  }

  if (!heartColor) {
    return { player: null, isNew: true, needsHeartColor: true };
  }

  const player = await createPlayer(nickname, heartColor);
  return { player, isNew: true, needsHeartColor: false };
}
