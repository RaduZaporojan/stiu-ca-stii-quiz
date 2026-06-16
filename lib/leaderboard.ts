import { prisma } from "./prisma";

export async function getLeaderboard(limit = 10) {
  return prisma.leaderboardEntry.findMany({
    take: limit,
    orderBy: [{ totalPermanentHearts: "desc" }, { updatedAt: "asc" }],
    include: {
      player: true,
    },
  });
}

export async function getPlayerLeaderboardEntry(playerId: string) {
  return prisma.leaderboardEntry.findUnique({
    where: { playerId },
    include: { player: true },
  });
}
