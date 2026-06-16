import Link from "next/link";
import type { Prisma } from "@prisma/client";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  ImageIcon,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import {
  createCategory,
  createQuestion,
  deleteCategory,
  deleteQuestion,
  updateCategory,
  updateQuestion,
} from "@/app/adminmagistru/actions";

type CategoryWithCount = Prisma.CategoryGetPayload<{
  include: { _count: { select: { questions: true } } };
}>;

type QuestionWithRelations = Prisma.QuestionGetPayload<{
  include: { category: true; answers: true };
}>;

type AdminFilters = {
  difficulty?: string;
  mode?: string;
  q?: string;
  status?: string;
};

type ContentWarnings = {
  categoryWarnings: Array<{
    categoryId: string;
    categoryName: string;
    issues: string[];
  }>;
  finalIssues: string[];
};

type AdminDashboardProps = {
  categories: CategoryWithCount[];
  filters: AdminFilters;
  notice?: string;
  openPanel?: string;
  questions: QuestionWithRelations[];
  selectedCategory: CategoryWithCount | null;
  selectedCategoryId?: string;
  stats: {
    categoriesTotal: number;
    categoriesActive: number;
    questionsTotal: number;
    questionsActive: number;
    finalQuestions: number;
  };
  warnings: ContentWarnings;
};

const noticeText: Record<string, string> = {
  "category-created": "Categoria a fost creată.",
  "category-updated": "Categoria a fost actualizată.",
  "category-deleted": "Categoria a fost ștearsă.",
  "category-invalid": "Categoria are câmpuri lipsă sau invalide.",
  "question-created": "Întrebarea a fost creată.",
  "question-updated": "Întrebarea a fost actualizată.",
  "question-deleted": "Întrebarea a fost ștearsă.",
  "question-invalid": "Întrebarea are câmpuri lipsă sau invalide.",
  "question-image-invalid":
    "Imaginea trebuie să fie JPG, PNG, WebP sau SVG și să aibă maximum 5 MB.",
};

const difficultyLabels = [
  "1 - foarte ușor",
  "2 - ușor",
  "3 - mediu",
  "4 - greu",
  "5 - foarte greu",
];

function fieldClasses(extra = "") {
  return `min-h-11 w-full rounded-[12px] border-2 border-stiucastiiBlue/40 bg-white px-3 py-2 text-[15px] font-semibold outline-none transition focus:border-stiucastiiBlue focus:ring-4 focus:ring-stiucastiiBlue/15 ${extra}`;
}

function buildAdminUrl(categoryId?: string, filters?: AdminFilters, panel?: string) {
  const params = new URLSearchParams();

  if (categoryId) params.set("category", categoryId);
  if (filters?.q?.trim()) params.set("q", filters.q.trim());
  if (filters?.status) params.set("status", filters.status);
  if (filters?.difficulty) params.set("difficulty", filters.difficulty);
  if (filters?.mode) params.set("mode", filters.mode);
  if (panel) params.set("panel", panel);

  const query = params.toString();
  return `/adminmagistru${query ? `?${query}` : ""}#intrebari`;
}

function AdminSubmitButton({
  children,
  tone = "primary",
}: {
  children: string;
  tone?: "primary" | "danger" | "soft";
}) {
  return (
    <button
      className={[
        "inline-flex min-h-11 items-center justify-center rounded-[12px] px-4 text-[15px] font-extrabold uppercase shadow-game transition hover:-translate-y-0.5",
        tone === "primary" ? "bg-stiucastiiBlue text-white" : "",
        tone === "danger" ? "bg-stiucastiiOrange text-white" : "",
        tone === "soft"
          ? "border-2 border-stiucastiiBlue bg-white text-stiucastiiBlue"
          : "",
      ].join(" ")}
      type="submit"
    >
      {children}
    </button>
  );
}

function CheckboxField({
  defaultChecked,
  label,
  name,
}: {
  defaultChecked?: boolean;
  label: string;
  name: string;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-[14px] font-extrabold">
      <input
        className="h-5 w-5 accent-stiucastiiBlue"
        defaultChecked={defaultChecked}
        name={name}
        type="checkbox"
      />
      {label}
    </label>
  );
}

function CategoryOptions({
  categories,
  selectedId,
}: {
  categories: CategoryWithCount[];
  selectedId?: string;
}) {
  return (
    <select className={fieldClasses()} defaultValue={selectedId} name="categoryId">
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
          {category.isActive ? "" : " (inactivă)"}
        </option>
      ))}
    </select>
  );
}

function DifficultySelect({ value = 1 }: { value?: number }) {
  return (
    <select
      className={fieldClasses()}
      defaultValue={String(value)}
      name="difficultyLevel"
    >
      {difficultyLabels.map((label, index) => (
        <option key={label} value={index + 1}>
          {label}
        </option>
      ))}
    </select>
  );
}

function AnswersEditor({ question }: { question?: QuestionWithRelations }) {
  const answers = Array.from({ length: 4 }, (_, index) => {
    return (
      question?.answers[index] ?? {
        id: `new-${index}`,
        text: "",
        isCorrect: index === 0,
      }
    );
  });
  const correctIndex = Math.max(
    0,
    answers.findIndex((answer) => answer.isCorrect),
  );

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {answers.map((answer, index) => (
        <label className="block text-[14px] font-extrabold" key={answer.id}>
          Răspuns {index + 1}
          <div className="mt-1 flex gap-2">
            <input
              className={fieldClasses()}
              defaultValue={answer.text}
              name={`answer-${index}`}
              placeholder={`Varianta ${index + 1}`}
              required
            />
            <input
              aria-label={`Marchează răspunsul ${index + 1} drept corect`}
              className="h-11 w-6 accent-stiucastiiBlue"
              defaultChecked={index === correctIndex}
              name="correctIndex"
              required
              type="radio"
              value={index}
            />
          </div>
        </label>
      ))}
    </div>
  );
}

function QuestionForm({
  action,
  categories,
  question,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  categories: CategoryWithCount[];
  question?: QuestionWithRelations;
  submitLabel: string;
}) {
  return (
    <form action={action} className="grid gap-4">
      {question ? <input name="id" type="hidden" value={question.id} /> : null}
      <div className="grid gap-4 md:grid-cols-[1fr_180px]">
        <label className="block text-[14px] font-extrabold">
          Categorie
          <CategoryOptions categories={categories} selectedId={question?.categoryId} />
        </label>
        <label className="block text-[14px] font-extrabold">
          Dificultate
          <DifficultySelect value={question?.difficultyLevel ?? 1} />
        </label>
      </div>

      <label className="block text-[14px] font-extrabold">
        Text întrebare
        <textarea
          className={fieldClasses("min-h-24 resize-y")}
          defaultValue={question?.text}
          name="text"
          placeholder="Scrie întrebarea așa cum apare în joc"
          required
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-[14px] font-extrabold">
          Imagine prin URL
          <input
            className={fieldClasses()}
            defaultValue={question?.imageUrl ?? ""}
            name="imageUrl"
            placeholder="/assets/questions/cinema.svg sau https://..."
          />
        </label>
        <label className="block text-[14px] font-extrabold">
          Upload imagine
          <input
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            className={fieldClasses("file:mr-3 file:rounded-[10px] file:border-0 file:bg-stiucastiiBlue file:px-3 file:py-2 file:text-[13px] file:font-extrabold file:uppercase file:text-white")}
            name="imageFile"
            type="file"
          />
        </label>
      </div>

      {question?.imageUrl ? (
        <div className="flex h-32 items-center justify-center overflow-hidden rounded-[12px] border-2 border-stiucastiiBlue/20 bg-stiucastiiBlue/5 p-2">
          <img
            alt=""
            className="max-h-full max-w-full object-contain"
            src={question.imageUrl}
          />
        </div>
      ) : null}

      <AnswersEditor question={question} />

      <label className="block text-[14px] font-extrabold">
        Explicație, opțional
        <textarea
          className={fieldClasses("min-h-20 resize-y")}
          defaultValue={question?.explanation ?? ""}
          name="explanation"
          placeholder="Se poate afișa ulterior după răspuns"
        />
      </label>

      <div className="grid gap-3 rounded-[14px] bg-stiucastiiBlue/8 p-4 md:grid-cols-4">
        <CheckboxField
          defaultChecked={question?.isActive ?? true}
          label="Activă"
          name="isActive"
        />
        <CheckboxField
          defaultChecked={question?.canAppearInNormalRounds ?? true}
          label="Runde normale"
          name="canAppearInNormalRounds"
        />
        <CheckboxField
          defaultChecked={question?.canAppearInFinalRound ?? false}
          label="Runda finală"
          name="canAppearInFinalRound"
        />
        <label className="block text-[14px] font-extrabold">
          Weight finală
          <input
            className={fieldClasses("mt-1")}
            defaultValue={question?.finalRoundWeight ?? 0}
            min={0}
            name="finalRoundWeight"
            type="number"
          />
        </label>
      </div>

      <AdminSubmitButton>{submitLabel}</AdminSubmitButton>
    </form>
  );
}

function CategoryForm({ category }: { category?: CategoryWithCount }) {
  return (
    <form action={category ? updateCategory : createCategory} className="grid gap-3">
      {category ? <input name="id" type="hidden" value={category.id} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-[14px] font-extrabold">
          Nume
          <input
            className={fieldClasses()}
            defaultValue={category?.name}
            name="name"
            placeholder="Ex: Republica Moldova"
            required
          />
        </label>
        <label className="block text-[14px] font-extrabold">
          Slug
          <input
            className={fieldClasses()}
            defaultValue={category?.slug}
            name="slug"
            placeholder="se generează automat dacă rămâne gol"
          />
        </label>
      </div>
      <label className="block text-[14px] font-extrabold">
        Descriere
        <textarea
          className={fieldClasses("min-h-20 resize-y")}
          defaultValue={category?.description ?? ""}
          name="description"
        />
      </label>
      <div className="grid gap-3 md:grid-cols-[1fr_120px_160px]">
        <label className="block text-[14px] font-extrabold">
          Accent
          <input
            className={fieldClasses()}
            defaultValue={category?.accentColor ?? "#0A87DD"}
            name="accentColor"
          />
        </label>
        <label className="block text-[14px] font-extrabold">
          Ordine
          <input
            className={fieldClasses()}
            defaultValue={category?.order ?? 0}
            name="order"
            type="number"
          />
        </label>
        <CheckboxField
          defaultChecked={category?.isActive ?? true}
          label="Activă în joc"
          name="isActive"
        />
      </div>
      <AdminSubmitButton>
        {category ? "Salvează categoria" : "Creează categoria"}
      </AdminSubmitButton>
    </form>
  );
}

function ContentWarningsPanel({ warnings }: { warnings: ContentWarnings }) {
  const totalIssues =
    warnings.finalIssues.length +
    warnings.categoryWarnings.reduce(
      (total, warning) => total + warning.issues.length,
      0,
    );

  return (
    <details className="rounded-[16px] border-2 border-stiucastiiOrange/70 bg-orange-50">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-stiucastiiOrange">
        <span className="flex items-center gap-2 text-[18px] font-extrabold">
          <AlertTriangle aria-hidden="true" size={22} />
          Audit conținut
        </span>
        <span className="rounded-full bg-stiucastiiOrange px-3 py-1 text-[13px] font-extrabold uppercase text-white">
          {totalIssues === 0 ? "OK" : `${totalIssues} probleme`}
        </span>
      </summary>
      <div className="grid gap-3 border-t border-stiucastiiOrange/20 px-4 pb-4 pt-3">
        {totalIssues === 0 ? (
          <p className="font-extrabold text-stiucastiiBlue">
            Conținutul curent are suficiente întrebări active pentru rundele MVP.
          </p>
        ) : null}
        {warnings.finalIssues.length > 0 ? (
          <div className="rounded-[12px] bg-white p-3">
            <p className="font-extrabold text-stiucastiiBlue">Runda finală</p>
            <ul className="mt-1 list-disc pl-5 text-[15px] font-bold">
              {warnings.finalIssues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {warnings.categoryWarnings.slice(0, 6).map((warning) => (
          <div className="rounded-[12px] bg-white p-3" key={warning.categoryId}>
            <p className="font-extrabold text-stiucastiiBlue">
              {warning.categoryName}
            </p>
            <ul className="mt-1 list-disc pl-5 text-[15px] font-bold">
              {warning.issues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}

function QuestionGamePreview({ question }: { question: QuestionWithRelations }) {
  return (
    <details className="rounded-[14px] border-2 border-stiucastiiBlue/20 bg-stiucastiiBlue/5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
        <span className="flex items-center gap-2 text-[16px] font-extrabold text-stiucastiiBlue">
          <Eye aria-hidden="true" size={20} />
          Preview în joc
        </span>
        <span className="rounded-full bg-stiucastiiBlue px-3 py-1 text-[12px] font-extrabold uppercase text-white">
          vezi
        </span>
      </summary>
      <div className="border-t border-stiucastiiBlue/15 px-4 pb-4 pt-4">
        <div className="mx-auto max-w-[620px] rounded-[16px] bg-white px-4 py-5 text-center shadow-soft">
          <p className="text-[24px] font-extrabold uppercase text-stiucastiiBlue">
            {question.category.name}
          </p>
          <h3 className="mx-auto mt-4 max-w-[560px] text-[23px] font-extrabold leading-tight text-[#00508f]">
            {question.text}
          </h3>
          {question.imageUrl ? (
            <div className="mx-auto mt-4 flex h-[190px] max-w-[380px] items-center justify-center overflow-hidden rounded-[12px] bg-stiucastiiBlue/8 p-2">
              <img
                alt=""
                className="max-h-full max-w-full object-contain"
                src={question.imageUrl}
              />
            </div>
          ) : null}
          <div className="mx-auto mt-5 grid max-w-[560px] gap-3 md:grid-cols-2">
            {question.answers.map((answer) => (
              <div
                className={[
                  "game-gradient min-h-[54px] rounded-[14px] px-4 py-3 text-center text-[17px] font-extrabold leading-tight text-white shadow-game",
                  answer.isCorrect ? "ring-4 ring-green-400" : "",
                ].join(" ")}
                key={answer.id}
              >
                {answer.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </details>
  );
}

function CategorySelector({
  categories,
  filters,
  selectedCategoryId,
}: {
  categories: CategoryWithCount[];
  filters: AdminFilters;
  selectedCategoryId?: string;
}) {
  return (
    <form action="/adminmagistru" className="grid gap-3 md:grid-cols-[1fr_auto]">
      <select
        className={fieldClasses("min-h-14 text-[17px] font-extrabold")}
        defaultValue={selectedCategoryId && selectedCategoryId !== "all" ? selectedCategoryId : ""}
        name="category"
      >
        <option value="">Alege categoria pentru întrebări</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name} · {category._count.questions} întrebări
            {category.isActive ? "" : " · inactivă"}
          </option>
        ))}
      </select>
      {filters.q ? <input name="q" type="hidden" value={filters.q} /> : null}
      {filters.status ? <input name="status" type="hidden" value={filters.status} /> : null}
      {filters.difficulty ? (
        <input name="difficulty" type="hidden" value={filters.difficulty} />
      ) : null}
      {filters.mode ? <input name="mode" type="hidden" value={filters.mode} /> : null}
      <button className="rounded-[14px] bg-stiucastiiBlue px-6 text-[18px] font-extrabold uppercase text-white shadow-game">
        Afișează
      </button>
    </form>
  );
}

function QuestionFilters({
  filters,
  selectedCategoryId,
}: {
  filters: AdminFilters;
  selectedCategoryId?: string;
}) {
  return (
    <details className="rounded-[16px] border-2 border-stiucastiiBlue/20 bg-white shadow-soft">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
        <span className="flex items-center gap-2 text-[18px] font-extrabold text-stiucastiiBlue">
          <Search aria-hidden="true" size={20} />
          Filtre
        </span>
        <span className="text-[14px] font-extrabold text-stiucastiiOrange">
          opțional
        </span>
      </summary>
      <form
        action="/adminmagistru"
        className="grid gap-3 border-t border-stiucastiiBlue/15 px-4 pb-4 pt-4 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto]"
      >
        <input name="category" type="hidden" value={selectedCategoryId ?? ""} />
        <input
          className={fieldClasses()}
          defaultValue={filters.q ?? ""}
          name="q"
          placeholder="Caută text"
        />
        <select className={fieldClasses()} defaultValue={filters.status ?? ""} name="status">
          <option value="">Toate stările</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          className={fieldClasses()}
          defaultValue={filters.difficulty ?? ""}
          name="difficulty"
        >
          <option value="">Orice dificultate</option>
          {[1, 2, 3, 4, 5].map((level) => (
            <option key={level} value={level}>
              Nivel {level}
            </option>
          ))}
        </select>
        <select className={fieldClasses()} defaultValue={filters.mode ?? ""} name="mode">
          <option value="">Orice mod</option>
          <option value="normal">Runde normale</option>
          <option value="final">Runda finală</option>
          <option value="image">Cu imagine</option>
        </select>
        <button className="rounded-[12px] bg-stiucastiiBlue px-4 text-[15px] font-extrabold uppercase text-white shadow-game">
          Aplică
        </button>
      </form>
    </details>
  );
}

export function AdminDashboard({
  categories,
  filters,
  notice,
  openPanel,
  questions,
  selectedCategory,
  selectedCategoryId,
  stats,
  warnings,
}: AdminDashboardProps) {
  const hasSelectedCategory = Boolean(selectedCategory);
  const categoryPanelOpen = openPanel === "category";
  const questionPanelOpen = openPanel === "question";

  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden bg-white">
      <section className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col px-4 py-6 sm:px-5 sm:py-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[16px] font-extrabold uppercase text-stiucastiiOrange">
              Admin magistru
            </p>
            <h1 className="mt-1 text-[32px] font-extrabold leading-tight text-stiucastiiBlue sm:text-[38px]">
              Întrebări și categorii
            </h1>
          </div>
          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:flex sm:flex-wrap">
            <Link
              className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[14px] bg-stiucastiiBlue px-4 text-[16px] font-extrabold uppercase text-white shadow-game transition hover:-translate-y-0.5 sm:h-[52px] sm:px-5 sm:text-[17px]"
              href={buildAdminUrl(selectedCategoryId, filters, "category")}
            >
              <Plus size={20} />
              Categorie nouă
            </Link>
            <Link
              className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[14px] bg-stiucastiiOrange px-4 text-[16px] font-extrabold uppercase text-white shadow-game transition hover:-translate-y-0.5 sm:h-[52px] sm:px-5 sm:text-[17px]"
              href={buildAdminUrl(selectedCategoryId, filters, "question")}
            >
              <ImageIcon size={20} />
              Întrebare nouă
            </Link>
            <Link
              className="inline-flex h-[50px] items-center justify-center rounded-[14px] border-2 border-stiucastiiBlue bg-white px-4 text-[16px] font-extrabold uppercase text-stiucastiiBlue shadow-game transition hover:-translate-y-0.5 sm:h-[52px] sm:px-5 sm:text-[17px]"
              href="/"
            >
              Joc
            </Link>
          </div>
        </div>

        {notice && noticeText[notice] ? (
          <div className="mt-5 flex items-center gap-3 rounded-[14px] bg-stiucastiiBlue/10 px-4 py-3 text-[16px] font-extrabold text-stiucastiiBlue">
            <CheckCircle2 aria-hidden="true" size={22} />
            {noticeText[notice]}
          </div>
        ) : null}

        <div className="mt-6 grid gap-3 md:grid-cols-5">
          {[
            ["Categorii", stats.categoriesTotal],
            ["Active", stats.categoriesActive],
            ["Întrebări", stats.questionsTotal],
            ["Întrebări active", stats.questionsActive],
            ["Finală", stats.finalQuestions],
          ].map(([label, value]) => (
            <div
              className="rounded-[14px] bg-stiucastiiBlue px-4 py-4 text-white shadow-soft"
              key={label}
            >
              <p className="text-[28px] font-extrabold leading-none">{value}</p>
              <p className="mt-1 text-[13px] font-bold uppercase">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4">
          <ContentWarningsPanel warnings={warnings} />

          {categoryPanelOpen ? (
            <section className="rounded-[18px] border-2 border-stiucastiiBlue/25 bg-white p-5 shadow-soft">
              <h2 className="text-[26px] font-extrabold text-stiucastiiBlue">
                Adaugă categorie
              </h2>
              <div className="mt-4">
                <CategoryForm />
              </div>
            </section>
          ) : null}

          {questionPanelOpen ? (
            <section className="rounded-[18px] border-2 border-stiucastiiBlue/25 bg-white p-5 shadow-soft">
              <h2 className="text-[26px] font-extrabold text-stiucastiiBlue">
                Adaugă întrebare
              </h2>
              <div className="mt-4">
                <QuestionForm
                  action={createQuestion}
                  categories={categories}
                  submitLabel="Creează întrebarea"
                />
              </div>
            </section>
          ) : null}

          <section className="rounded-[18px] border-2 border-stiucastiiBlue/25 bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-[26px] font-extrabold text-stiucastiiBlue">
                  Întrebări
                </h2>
                <p className="text-[16px] font-semibold">
                  Selectează categoria din dropdown, apoi lucrezi doar pe setul ei.
                </p>
              </div>
              {selectedCategory ? (
                <Link
                  className="w-fit rounded-[12px] border-2 border-stiucastiiBlue px-4 py-2 text-[15px] font-extrabold uppercase text-stiucastiiBlue"
                  href={buildAdminUrl(selectedCategory.id, {}, undefined)}
                >
                  Resetează filtre
                </Link>
              ) : null}
            </div>

            <div className="mt-4">
              <CategorySelector
                categories={categories}
                filters={filters}
                selectedCategoryId={selectedCategoryId}
              />
            </div>

            {hasSelectedCategory ? (
              <div className="mt-4">
                <QuestionFilters
                  filters={filters}
                  selectedCategoryId={selectedCategoryId}
                />
              </div>
            ) : null}

            {!hasSelectedCategory ? (
              <p className="mt-5 rounded-[14px] bg-stiucastiiBlue/8 px-4 py-5 text-[18px] font-bold">
                Alege o categorie pentru a afișa lista de întrebări.
              </p>
            ) : null}

            {selectedCategory ? (
              <div className="mt-5">
                <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-[14px] font-extrabold uppercase text-stiucastiiOrange">
                      {selectedCategory.name}
                    </p>
                    <h3 className="text-[24px] font-extrabold text-stiucastiiBlue">
                      {questions.length} întrebări afișate
                    </h3>
                  </div>
                  <p className="text-[15px] font-bold">
                    {selectedCategory._count.questions} întrebări total în categorie
                  </p>
                </div>

                {questions.length === 0 ? (
                  <div className="rounded-[14px] bg-stiucastiiBlue/8 px-4 py-5 text-[17px] font-bold">
                    <p>Nu există întrebări pentru filtrul curent.</p>
                    <Link
                      className="mt-3 inline-flex rounded-[12px] bg-stiucastiiBlue px-4 py-2 text-[14px] font-extrabold uppercase text-white shadow-game"
                      href={buildAdminUrl(selectedCategory.id)}
                    >
                      Resetează filtrele
                    </Link>
                  </div>
                ) : null}

                <div className="grid gap-3">
                  {questions.map((question) => (
                    <details
                      className="rounded-[14px] border-2 border-stiucastiiBlue/20 bg-white shadow-soft"
                      key={question.id}
                    >
                      <summary className="cursor-pointer list-none px-4 py-3">
                        <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-center">
                          <div className="min-w-0">
                            <p className="text-[13px] font-extrabold uppercase text-stiucastiiOrange">
                              dificultate {question.difficultyLevel} ·{" "}
                              {question.isActive ? "activă" : "inactivă"} ·{" "}
                              {question.canAppearInFinalRound ? "finală" : "normal"}
                              {question.imageUrl ? " · cu imagine" : ""}
                            </p>
                            <h4 className="mt-1 line-clamp-2 text-[19px] font-extrabold leading-tight text-stiucastiiBlue">
                              {question.text}
                            </h4>
                          </div>
                          <Pencil
                            className="text-stiucastiiOrange"
                            aria-hidden="true"
                          />
                        </div>
                      </summary>
                      <div className="grid gap-4 border-t border-stiucastiiBlue/15 px-4 pb-4 pt-4">
                        <QuestionGamePreview question={question} />
                        <QuestionForm
                          action={updateQuestion}
                          categories={categories}
                          question={question}
                          submitLabel="Salvează întrebarea"
                        />
                        <form action={deleteQuestion}>
                          <input name="id" type="hidden" value={question.id} />
                          <input
                            name="categoryId"
                            type="hidden"
                            value={question.categoryId}
                          />
                          <button
                            className="inline-flex min-h-11 items-center gap-2 rounded-[12px] bg-stiucastiiOrange px-4 text-[15px] font-extrabold uppercase text-white shadow-game transition hover:-translate-y-0.5"
                            type="submit"
                          >
                            <Trash2 aria-hidden="true" size={18} />
                            Șterge întrebarea
                          </button>
                        </form>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <details className="rounded-[18px] border-2 border-stiucastiiBlue/20 bg-white shadow-soft">
            <summary className="cursor-pointer list-none px-5 py-4 text-[22px] font-extrabold text-stiucastiiBlue">
              Administrare categorii existente
            </summary>
            <div className="grid gap-3 border-t border-stiucastiiBlue/15 px-5 pb-5 pt-4">
              {categories.map((category) => (
                <details
                  className="rounded-[14px] border-2 border-stiucastiiBlue/15 p-4"
                  key={category.id}
                >
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-[20px] font-extrabold text-stiucastiiBlue">
                          {category.name}
                        </h3>
                        <p className="text-[14px] font-bold">
                          {category._count.questions} întrebări ·{" "}
                          {category.isActive ? "activă" : "inactivă"}
                        </p>
                      </div>
                      <Pencil className="text-stiucastiiOrange" aria-hidden="true" />
                    </div>
                  </summary>
                  <div className="mt-4">
                    <CategoryForm category={category} />
                    <form action={deleteCategory} className="mt-3">
                      <input name="id" type="hidden" value={category.id} />
                      <AdminSubmitButton tone="danger">
                        Șterge categoria
                      </AdminSubmitButton>
                    </form>
                  </div>
                </details>
              ))}
            </div>
          </details>
        </div>
      </section>
      <Footer />
    </main>
  );
}
