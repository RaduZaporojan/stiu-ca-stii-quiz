import { PrismaClient, type HeartColor } from "@prisma/client";
import { contentBoostQuestions } from "../lib/content-boost";
import { extraTextQuestions } from "../lib/extra-text-questions";
import { questionBank } from "../lib/question-bank";

const prisma = new PrismaClient();
const seedQuestionBank = [...questionBank, ...contentBoostQuestions, ...extraTextQuestions];

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const categoryDescriptions: Record<string, string> = {
  "CASCADĂ": "Cascade, ape curgătoare și fenomene naturale.",
  "PICTURI MURALE": "Fresce, artă murală și patrimoniu vizual.",
  "GHICEȘTE ȚARA": "Geografie, capitale și repere europene.",
  "PERSONALITĂȚI": "Figuri culturale, istorice și artistice.",
  "IMAGINI CONECTATE": "Asocieri vizuale și teme culturale.",
  "LITERATURĂ": "Autori, opere și curente literare.",
  "ISTORIE": "Repere istorice românești și moldovenești.",
  "CINEMA": "Filme, regizori și cultura cinematografică.",
  "MUZICĂ": "Compozitori, interpreți și tradiții muzicale.",
  "TRADIȚII": "Obiceiuri, port popular și sărbători.",
  "GEOGRAFIE": "Relief, râuri, orașe și țări.",
  "LIMBA ROMÂNĂ": "Gramatică, vocabular și expresii românești.",
  "ȘTIINȚĂ": "Noțiuni de știință, natură și descoperire.",
};

const demoPlayers: Array<{
  nickname: string;
  heartColor: HeartColor;
  hearts: number;
  won: number;
  lost: number;
}> = [
  { nickname: "Ionel Ionescu", heartColor: "orange", hearts: 0, won: 0, lost: 0 },
  { nickname: "Zinaida Zenovia", heartColor: "orange", hearts: 0, won: 0, lost: 0 },
  { nickname: "Alexandra Joviala", heartColor: "blue", hearts: 0, won: 0, lost: 0 },
  { nickname: "Onisifor Ghibu", heartColor: "orange", hearts: 0, won: 0, lost: 0 },
  { nickname: "Flavius Macari", heartColor: "blue", hearts: 0, won: 0, lost: 0 },
];

async function seedCategories() {
  const categories = [
    ...new Set(
      seedQuestionBank
        .filter((question) => !question.finalRound)
        .map((question) => question.category),
    ),
  ];

  const records = new Map<string, { id: string; name: string }>();

  for (const [index, name] of categories.entries()) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(name) },
      create: {
        name,
        slug: slugify(name),
        description: categoryDescriptions[name],
        accentColor: index % 2 === 0 ? "#F26B25" : "#0A87DD",
        order: index + 1,
        isActive: true,
      },
      update: {
        name,
        description: categoryDescriptions[name],
        accentColor: index % 2 === 0 ? "#F26B25" : "#0A87DD",
        order: index + 1,
        isActive: true,
      },
    });

    records.set(name, category);
  }

  await prisma.category.updateMany({
    where: {
      name: {
        notIn: [...categories, "RUNDA FINALĂ"],
      },
    },
    data: {
      isActive: false,
    },
  });

  return records;
}

async function seedQuestions(categoryByName: Map<string, { id: string; name: string }>) {
  await prisma.gameAnswer.deleteMany();
  await prisma.gameSessionQuestion.deleteMany();
  await prisma.gameSession.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();

  const finalCategory = await prisma.category.upsert({
    where: { slug: "runda-finala" },
    create: {
      name: "RUNDA FINALĂ",
      slug: "runda-finala",
      description: "Pool special pentru întrebările finale.",
      accentColor: "#0A87DD",
      order: 99,
      isActive: false,
    },
    update: {
      name: "RUNDA FINALĂ",
      description: "Pool special pentru întrebările finale.",
      isActive: false,
    },
  });

  for (const source of seedQuestionBank) {
    const category = source.finalRound
      ? finalCategory
      : categoryByName.get(source.category);

    if (!category) {
      throw new Error(`Missing category for ${source.category}`);
    }

    const question = await prisma.question.create({
      data: {
        categoryId: category.id,
        text: source.text,
        imageUrl: null,
        difficultyLevel: source.difficulty,
        explanation: null,
        isActive: true,
        canAppearInNormalRounds: !source.finalRound,
        canAppearInFinalRound: Boolean(source.finalRound),
        finalRoundWeight: source.finalRound ? source.difficulty : 0,
        answers: {
          create: source.answers.map((answer) => ({
            text: answer.text,
            isCorrect: answer.id === source.correctAnswerId,
          })),
        },
      },
    });

    console.log(`Seeded question: ${question.text}`);
  }
}

async function seedLeaderboard() {
  for (const demo of demoPlayers) {
    const player = await prisma.player.upsert({
      where: { nickname: demo.nickname },
      create: {
        nickname: demo.nickname,
        heartColor: demo.heartColor,
      },
      update: {
        heartColor: demo.heartColor,
      },
    });

    await prisma.leaderboardEntry.upsert({
      where: { playerId: player.id },
      create: {
        playerId: player.id,
        totalPermanentHearts: demo.hearts,
        gamesWon: demo.won,
        gamesLost: demo.lost,
      },
      update: {
        totalPermanentHearts: demo.hearts,
        gamesWon: demo.won,
        gamesLost: demo.lost,
      },
    });
  }
}

async function main() {
  const categories = await seedCategories();
  await seedQuestions(categories);
  await seedLeaderboard();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
