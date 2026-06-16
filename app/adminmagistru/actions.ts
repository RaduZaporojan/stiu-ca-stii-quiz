"use server";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "stiucastii_adminmagistru";
const ADMIN_PATH = "/adminmagistru";
const QUESTION_UPLOAD_DIR = join(process.cwd(), "public", "uploads", "questions");
const MAX_QUESTION_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/svg+xml", "svg"],
]);

function normalizeText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function normalizeOptionalText(value: FormDataEntryValue | null) {
  const text = normalizeText(value);
  return text.length > 0 ? text : null;
}

function normalizeInt(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeBoolean(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

async function saveUploadedQuestionImage(formData: FormData) {
  const imageFile = formData.get("imageFile");

  if (!(imageFile instanceof File) || imageFile.size === 0) {
    return null;
  }

  const extension = ALLOWED_IMAGE_TYPES.get(imageFile.type);
  if (!extension || imageFile.size > MAX_QUESTION_IMAGE_SIZE) {
    redirect(`${ADMIN_PATH}?notice=question-image-invalid#intrebari`);
  }

  const bytes = Buffer.from(await imageFile.arrayBuffer());
  const fileName = `question-${Date.now()}-${randomUUID()}.${extension}`;

  await mkdir(QUESTION_UPLOAD_DIR, { recursive: true });
  await writeFile(join(QUESTION_UPLOAD_DIR, fileName), bytes);

  return `/uploads/questions/${fileName}`;
}

async function requireAdminMagistru() {
  if (!(await isAdminMagistruUnlocked())) {
    redirect(`${ADMIN_PATH}?error=1`);
  }
}

export async function unlockAdminMagistru(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    redirect("/adminmagistru?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "unlocked", {
    httpOnly: true,
    sameSite: "lax",
    path: ADMIN_PATH,
    maxAge: 60 * 60 * 6,
  });

  redirect(ADMIN_PATH);
}

export async function isAdminMagistruUnlocked() {
  const cookieStore = await cookies();

  return cookieStore.get(COOKIE_NAME)?.value === "unlocked";
}

export async function createCategory(formData: FormData) {
  await requireAdminMagistru();

  const name = normalizeText(formData.get("name"));
  const providedSlug = normalizeText(formData.get("slug"));
  const slug = providedSlug || slugify(name);

  if (!name || !slug) {
    redirect(`${ADMIN_PATH}?notice=category-invalid`);
  }

  await prisma.category.create({
    data: {
      name,
      slug,
      description: normalizeOptionalText(formData.get("description")),
      accentColor: normalizeOptionalText(formData.get("accentColor")),
      order: normalizeInt(formData.get("order"), 0),
      isActive: normalizeBoolean(formData.get("isActive")),
    },
  });

  revalidatePath(ADMIN_PATH);
  redirect(`${ADMIN_PATH}?notice=category-created`);
}

export async function updateCategory(formData: FormData) {
  await requireAdminMagistru();

  const id = normalizeText(formData.get("id"));
  const name = normalizeText(formData.get("name"));
  const providedSlug = normalizeText(formData.get("slug"));
  const slug = providedSlug || slugify(name);

  if (!id || !name || !slug) {
    redirect(`${ADMIN_PATH}?notice=category-invalid`);
  }

  await prisma.category.update({
    where: { id },
    data: {
      name,
      slug,
      description: normalizeOptionalText(formData.get("description")),
      accentColor: normalizeOptionalText(formData.get("accentColor")),
      order: normalizeInt(formData.get("order"), 0),
      isActive: normalizeBoolean(formData.get("isActive")),
    },
  });

  revalidatePath(ADMIN_PATH);
  redirect(`${ADMIN_PATH}?notice=category-updated`);
}

export async function deleteCategory(formData: FormData) {
  await requireAdminMagistru();

  const id = normalizeText(formData.get("id"));
  if (!id) {
    redirect(`${ADMIN_PATH}?notice=category-invalid`);
  }

  await prisma.category.delete({ where: { id } });

  revalidatePath(ADMIN_PATH);
  redirect(`${ADMIN_PATH}?notice=category-deleted`);
}

async function readQuestionPayload(formData: FormData) {
  const categoryId = normalizeText(formData.get("categoryId"));
  const text = normalizeText(formData.get("text"));
  const correctIndex = normalizeInt(formData.get("correctIndex"), 0);
  const uploadedImageUrl = await saveUploadedQuestionImage(formData);

  const answers = [0, 1, 2, 3].map((index) => ({
    text: normalizeText(formData.get(`answer-${index}`)),
    isCorrect: index === correctIndex,
  }));

  if (!categoryId || !text || answers.some((answer) => !answer.text)) {
    return null;
  }

  return {
    categoryId,
    text,
    imageUrl: uploadedImageUrl ?? normalizeOptionalText(formData.get("imageUrl")),
    explanation: normalizeOptionalText(formData.get("explanation")),
    difficultyLevel: Math.min(
      5,
      Math.max(1, normalizeInt(formData.get("difficultyLevel"), 1)),
    ),
    isActive: normalizeBoolean(formData.get("isActive")),
    canAppearInNormalRounds: normalizeBoolean(
      formData.get("canAppearInNormalRounds"),
    ),
    canAppearInFinalRound: normalizeBoolean(formData.get("canAppearInFinalRound")),
    finalRoundWeight: normalizeInt(formData.get("finalRoundWeight"), 0),
    answers,
  };
}

export async function createQuestion(formData: FormData) {
  await requireAdminMagistru();

  const payload = await readQuestionPayload(formData);
  if (!payload) {
    redirect(`${ADMIN_PATH}?notice=question-invalid`);
  }

  await prisma.question.create({
    data: {
      categoryId: payload.categoryId,
      text: payload.text,
      imageUrl: payload.imageUrl,
      explanation: payload.explanation,
      difficultyLevel: payload.difficultyLevel,
      isActive: payload.isActive,
      canAppearInNormalRounds: payload.canAppearInNormalRounds,
      canAppearInFinalRound: payload.canAppearInFinalRound,
      finalRoundWeight: payload.finalRoundWeight,
      answers: {
        create: payload.answers,
      },
    },
  });

  revalidatePath(ADMIN_PATH);
  redirect(`${ADMIN_PATH}?category=${payload.categoryId}&notice=question-created#intrebari`);
}

export async function updateQuestion(formData: FormData) {
  await requireAdminMagistru();

  const id = normalizeText(formData.get("id"));
  const payload = await readQuestionPayload(formData);
  if (!id || !payload) {
    redirect(`${ADMIN_PATH}?notice=question-invalid`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.question.update({
      where: { id },
      data: {
        categoryId: payload.categoryId,
        text: payload.text,
        imageUrl: payload.imageUrl,
        explanation: payload.explanation,
        difficultyLevel: payload.difficultyLevel,
        isActive: payload.isActive,
        canAppearInNormalRounds: payload.canAppearInNormalRounds,
        canAppearInFinalRound: payload.canAppearInFinalRound,
        finalRoundWeight: payload.finalRoundWeight,
      },
    });

    await tx.answer.deleteMany({ where: { questionId: id } });
    await tx.answer.createMany({
      data: payload.answers.map((answer) => ({
        questionId: id,
        text: answer.text,
        isCorrect: answer.isCorrect,
      })),
    });
  });

  revalidatePath(ADMIN_PATH);
  redirect(`${ADMIN_PATH}?category=${payload.categoryId}&notice=question-updated#intrebari`);
}

export async function deleteQuestion(formData: FormData) {
  await requireAdminMagistru();

  const id = normalizeText(formData.get("id"));
  const categoryId = normalizeText(formData.get("categoryId"));
  if (!id) {
    redirect(`${ADMIN_PATH}?notice=question-invalid`);
  }

  await prisma.question.delete({ where: { id } });

  revalidatePath(ADMIN_PATH);
  redirect(
    categoryId
      ? `${ADMIN_PATH}?category=${categoryId}&notice=question-deleted#intrebari`
      : `${ADMIN_PATH}?notice=question-deleted`,
  );
}
