import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const suffix = Date.now().toString().slice(-6);
  const nickname = `LoseTest${suffix}`;

  const finalQuestion = await prisma.question.findFirst({
    where: {
      isActive: true,
      canAppearInFinalRound: true,
      answers: {
        some: {
          isCorrect: false,
        },
      },
    },
    include: {
      answers: true,
    },
    orderBy: [{ difficultyLevel: "desc" }, { updatedAt: "desc" }],
  });

  if (!finalQuestion) {
    throw new Error("No final question with a wrong answer is available.");
  }

  const wrongAnswer = finalQuestion.answers.find((answer) => !answer.isCorrect);

  if (!wrongAnswer) {
    throw new Error("Selected final question does not have a wrong answer.");
  }

  const player = await prisma.player.create({
    data: {
      nickname,
      heartColor: "orange",
      leaderboard: {
        create: {
          totalPermanentHearts: 0,
          gamesWon: 0,
          gamesLost: 0,
        },
      },
    },
  });

  const session = await prisma.gameSession.create({
    data: {
      playerId: player.id,
      heartColor: player.heartColor,
      currentPhase: "final",
      normalRoundsCompleted: 3,
      temporaryHearts: 0,
      heartsEarnedNormal: 0,
      finalQuestionsCompleted: 0,
      sessionQuestions: {
        create: {
          questionId: finalQuestion.id,
          phase: "final",
          roundNumber: null,
          orderIndex: 0,
        },
      },
    },
  });

  console.log(
    JSON.stringify(
      {
        nickname,
        sessionId: session.id,
        url: `http://127.0.0.1:3000/play/session/${session.id}`,
        question: finalQuestion.text,
        wrongAnswer: wrongAnswer.text,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
