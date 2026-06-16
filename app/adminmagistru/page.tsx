import type { Prisma } from "@prisma/client";
import { LockKeyhole } from "lucide-react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AppButton } from "@/components/layout/AppButton";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { isAdminMagistruUnlocked, unlockAdminMagistru } from "./actions";

export const dynamic = "force-dynamic";

type AdminMagistruPageProps = {
  searchParams?: Promise<{
    category?: string;
    difficulty?: string;
    error?: string;
    mode?: string;
    notice?: string;
    panel?: string;
    q?: string;
    status?: string;
  }>;
};

function parseDifficulty(value?: string) {
  const parsed = Number.parseInt(value ?? "", 10);
  return parsed >= 1 && parsed <= 5 ? parsed : undefined;
}

function buildQuestionWhere(params?: {
  category?: string;
  difficulty?: string;
  mode?: string;
  q?: string;
  status?: string;
}) {
  const selectedCategoryId = params?.category;

  if (!selectedCategoryId || selectedCategoryId === "all") {
    return { id: "__no_questions_until_category_is_selected__" };
  }

  const where: Prisma.QuestionWhereInput = { categoryId: selectedCategoryId };
  const difficulty = parseDifficulty(params?.difficulty);

  if (difficulty) where.difficultyLevel = difficulty;
  if (params?.status === "active") where.isActive = true;
  if (params?.status === "inactive") where.isActive = false;
  if (params?.mode === "normal") where.canAppearInNormalRounds = true;
  if (params?.mode === "final") where.canAppearInFinalRound = true;
  if (params?.mode === "image") where.imageUrl = { not: null };

  const query = params?.q?.trim();
  if (query) {
    where.OR = [
      { text: { contains: query, mode: "insensitive" } },
      { explanation: { contains: query, mode: "insensitive" } },
      { answers: { some: { text: { contains: query, mode: "insensitive" } } } },
    ];
  }

  return where;
}

async function getContentWarnings() {
  const [categories, finalTotal, finalHard, finalVeryHard] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: { id: true, name: true, isActive: true },
    }),
    prisma.question.count({
      where: { isActive: true, canAppearInFinalRound: true },
    }),
    prisma.question.count({
      where: {
        isActive: true,
        canAppearInFinalRound: true,
        difficultyLevel: { in: [4, 5] },
      },
    }),
    prisma.question.count({
      where: {
        isActive: true,
        canAppearInFinalRound: true,
        difficultyLevel: 5,
      },
    }),
  ]);

  const categoryWarnings = await Promise.all(
    categories
      .filter((category) => category.isActive)
      .map(async (category) => {
        const [round1, round2, round3, normalTotal] = await prisma.$transaction([
          prisma.question.count({
            where: {
              categoryId: category.id,
              isActive: true,
              canAppearInNormalRounds: true,
              difficultyLevel: { in: [1, 2] },
            },
          }),
          prisma.question.count({
            where: {
              categoryId: category.id,
              isActive: true,
              canAppearInNormalRounds: true,
              difficultyLevel: { in: [2, 3] },
            },
          }),
          prisma.question.count({
            where: {
              categoryId: category.id,
              isActive: true,
              canAppearInNormalRounds: true,
              difficultyLevel: { in: [3, 4] },
            },
          }),
          prisma.question.count({
            where: {
              categoryId: category.id,
              isActive: true,
              canAppearInNormalRounds: true,
            },
          }),
        ]);

        const issues = [
          round1 < 5 ? `Runda 1 are ${round1}/5 întrebări active` : null,
          round2 < 5 ? `Runda 2 are ${round2}/5 întrebări active` : null,
          round3 < 5 ? `Runda 3 are ${round3}/5 întrebări active` : null,
          normalTotal < 15 ? `Total normal ${normalTotal}/15` : null,
        ].filter(Boolean) as string[];

        return {
          categoryId: category.id,
          categoryName: category.name,
          issues,
        };
      }),
  );

  const finalIssues = [
    finalTotal < 16 ? `Finala are ${finalTotal}/16 întrebări active` : null,
    finalHard < 8
      ? `Finala are doar ${finalHard} întrebări grele sau foarte grele`
      : null,
    finalVeryHard < 3
      ? `Finala are doar ${finalVeryHard} întrebări de nivel 5`
      : null,
  ].filter(Boolean) as string[];

  return {
    categoryWarnings: categoryWarnings.filter((warning) => warning.issues.length > 0),
    finalIssues,
  };
}

export default async function AdminMagistruPage({
  searchParams,
}: AdminMagistruPageProps) {
  const params = await searchParams;
  const unlocked = await isAdminMagistruUnlocked();

  if (unlocked) {
    const selectedCategoryId = params?.category;
    const questionWhere = buildQuestionWhere(params);

    const categories = await prisma.category.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: {
        _count: { select: { questions: true } },
      },
    });

    const [questions, stats, warnings] = await Promise.all([
      prisma.question.findMany({
        where: questionWhere,
        orderBy: [{ updatedAt: "desc" }],
        take: 100,
        include: {
          category: true,
          answers: { orderBy: { id: "asc" } },
        },
      }),
      prisma.$transaction([
        prisma.category.count(),
        prisma.category.count({ where: { isActive: true } }),
        prisma.question.count(),
        prisma.question.count({ where: { isActive: true } }),
        prisma.question.count({ where: { canAppearInFinalRound: true } }),
      ]),
      getContentWarnings(),
    ]);

    const selectedCategory =
      selectedCategoryId && selectedCategoryId !== "all"
        ? categories.find((category) => category.id === selectedCategoryId) ?? null
        : null;

    return (
      <AdminDashboard
        categories={categories}
        filters={{
          difficulty: params?.difficulty,
          mode: params?.mode,
          q: params?.q,
          status: params?.status,
        }}
        notice={params?.notice}
        openPanel={params?.panel}
        questions={questions}
        selectedCategory={selectedCategory}
        selectedCategoryId={selectedCategoryId}
        stats={{
          categoriesTotal: stats[0],
          categoriesActive: stats[1],
          questionsTotal: stats[2],
          questionsActive: stats[3],
          finalQuestions: stats[4],
        }}
        warnings={warnings}
      />
    );
  }

  const hasError = params?.error === "1";

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <section className="mx-auto flex w-full max-w-[560px] flex-1 flex-col items-center justify-center px-5 py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stiucastiiBlue text-white shadow-soft">
          <LockKeyhole aria-hidden="true" size={38} strokeWidth={3} />
        </div>
        <p className="mt-7 text-[18px] font-extrabold uppercase text-stiucastiiOrange">
          Admin magistru
        </p>
        <h1 className="mt-2 text-[38px] font-extrabold leading-tight text-stiucastiiBlue">
          Acces conținut joc
        </h1>
        <p className="mt-3 max-w-[460px] text-[19px] font-semibold leading-snug">
          Aici se adaugă manual categoriile și întrebările. Setările pentru
          jucători rămân în meniul normal de joc.
        </p>

        <form action={unlockAdminMagistru} className="mt-8 w-full">
          <label className="text-left text-[18px] font-extrabold" htmlFor="password">
            Parolă admin
          </label>
          <input
            autoComplete="current-password"
            className="mt-2 h-14 w-full rounded-[14px] border-2 border-stiucastiiBlue px-4 text-center text-[22px] font-bold outline-none transition focus:ring-4 focus:ring-stiucastiiBlue/20"
            id="password"
            name="password"
            required
            type="password"
          />
          {hasError ? (
            <p className="mt-3 text-[17px] font-extrabold text-stiucastiiOrange">
              Parola nu este corectă.
            </p>
          ) : null}
          <AppButton className="mt-6 w-full min-w-0" href={undefined}>
            Intră în admin
          </AppButton>
        </form>
      </section>
      <Footer />
    </main>
  );
}
