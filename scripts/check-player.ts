import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const nickname = process.argv[2];

  if (!nickname) {
    throw new Error("Usage: npx tsx scripts/check-player.ts <nickname>");
  }

  const player = await prisma.player.findUnique({
    where: { nickname },
    include: {
      leaderboard: true,
      sessions: {
        orderBy: { startedAt: "desc" },
        take: 3,
      },
    },
  });

  console.log(JSON.stringify(player, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
