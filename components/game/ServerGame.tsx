"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  completeNormalRoundAction,
  getCategoryOptionsAction,
  prepareFinalRoundAction,
  prepareNormalRoundAction,
  submitFinalAnswerAction,
  submitNormalAnswerAction,
} from "@/app/play/session/actions";
import { AnswerButton } from "@/components/game/AnswerButton";
import { BouncyQuestionText } from "@/components/game/BouncyQuestionText";
import { CategoryDrawer } from "@/components/game/CategoryDrawer";
import { CorrectAnswerPopUp } from "@/components/game/CorrectAnswerPopUp";
import { Heart } from "@/components/game/Heart";
import { MovingBallsTitle } from "@/components/game/MovingBallsTitle";
import { PlayerStatus } from "@/components/game/PlayerStatus";
import {
  RoundTransitionOverlay,
  type RoundTransitionPhase,
} from "@/components/game/RoundTransitionOverlay";
import { TimerCapsule } from "@/components/game/TimerCapsule";
import { AppButton } from "@/components/layout/AppButton";
import type {
  GameResumeSnapshot,
  PublicCategory,
  PublicGameFeedback,
  PublicGameQuestion,
} from "@/lib/game-session";
import { cn } from "@/lib/utils";

type Phase =
  | "choosing_category"
  | "loading_round"
  | "question_active"
  | "question_answered"
  | "final_intro"
  | "won"
  | "lost";

type Feedback = PublicGameFeedback;

type CorrectPopUp = {
  id: number;
  left: number;
  top: number;
  rotation: number;
  sequence: "ioana-app1" | "ioana-app2" | "ioana-app4";
  size: number;
};

type AudioCue =
  | "intro-start"
  | "intro-stop"
  | "normal-correct"
  | "normal-wrong"
  | "final-correct"
  | "final-wrong-heart-lost"
  | "final-wrong-lost"
  | "final-last-heart"
  | "final-question-13"
  | "final-question-16"
  | "final-won"
  | "timer-urgent"
  | "timer-stop";

type ServerGameProps = {
  sessionId: string;
  playerName: string;
  playerHeartColor: "orange" | "blue";
  initialCategories: PublicCategory[];
  initialTemporaryHearts?: number;
  initialState?: GameResumeSnapshot;
};

const QUESTION_SECONDS = 30;
const COVER_DURATION_MS = 860;
const HEART_HOLD_MS = 900;
const REVEAL_DURATION_MS = 860;
const popUpSequences: CorrectPopUp["sequence"][] = [
  "ioana-app1",
];

const popUpAnchors = [
  { left: 18, top: 26 },
  { left: 36, top: 42 },
  { left: 58, top: 30 },
  { left: 78, top: 50 },
  { left: 25, top: 72 },
  { left: 52, top: 66 },
  { left: 82, top: 76 },
];

function formatTime(seconds: number) {
  return `00:${String(seconds).padStart(2, "0")}`;
}

function emitAudioCue(cue: AudioCue, detail: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("stiucastii:audio-cue", {
      detail: {
        cue,
        ...detail,
      },
    }),
  );
}

function FinalRoundProgress({
  current,
  total = 16,
}: {
  current: number;
  total?: number;
}) {
  return (
    <div
      aria-label={`Finala: intrebarea ${current} din ${total}`}
      className="final-round-progress mt-3"
    >
      {Array.from({ length: total }).map((_, index) => {
        const step = index + 1;
        const isComplete = step < current;
        const isCurrent = step === current;
        const isEndgame = step > total - 4;

        return (
          <span
            aria-hidden="true"
            className={cn(
              "final-round-dot",
              isComplete && "final-round-dot-complete",
              isCurrent && "final-round-dot-current",
              isEndgame && "final-round-dot-endgame",
            )}
            key={step}
          />
        );
      })}
    </div>
  );
}

export function ServerGame({
  sessionId,
  playerName,
  playerHeartColor,
  initialCategories,
  initialTemporaryHearts = 0,
  initialState,
}: ServerGameProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>(
    initialState?.phase ?? "choosing_category",
  );
  const [round, setRound] = useState(initialState?.round ?? 1);
  const [questionIndex, setQuestionIndex] = useState(
    initialState?.questionIndex ?? 0,
  );
  const [finalIndex, setFinalIndex] = useState(initialState?.finalIndex ?? 0);
  const [normalQuestions, setNormalQuestions] = useState<PublicGameQuestion[]>(
    initialState?.normalQuestions ?? [],
  );
  const [finalQuestions, setFinalQuestions] = useState<PublicGameQuestion[]>(
    initialState?.finalQuestions ?? [],
  );
  const [categoryOptions, setCategoryOptions] =
    useState<PublicCategory[]>(initialCategories);
  const [temporaryHearts, setTemporaryHearts] = useState(initialTemporaryHearts);
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_SECONDS);
  const [questionIntroComplete, setQuestionIntroComplete] = useState(
    initialState?.phase === "question_active" ? false : true,
  );
  const [feedback, setFeedback] = useState<Feedback | null>(
    initialState?.feedback ?? null,
  );
  const [pendingAnswerId, setPendingAnswerId] = useState<string | null>(null);
  const [lastCategory, setLastCategory] = useState(
    initialState?.lastCategory ?? "Categorie",
  );
  const [transitionPhase, setTransitionPhase] =
    useState<RoundTransitionPhase>("idle");
  const [transitionMessage, setTransitionMessage] = useState("Succes!");
  const [correctPopUps, setCorrectPopUps] = useState<CorrectPopUp[]>([]);
  const [lostHeartSignal, setLostHeartSignal] = useState(0);
  const correctAnswerCountRef = useRef(0);
  const correctPopUpIdRef = useRef(0);
  const lastHeartCueRef = useRef(false);
  const finalMilestoneCueRef = useRef(new Set<number>());
  const timerCueQuestionRef = useRef<string | null>(null);

  const isFinal = finalQuestions.length > 0 && round > 3;
  const finalQuestionNumber = isFinal ? Math.min(finalIndex + 1, 16) : 0;
  const isLastHeartWarning = isFinal && temporaryHearts === 1;
  const currentQuestion = isFinal
    ? finalQuestions[finalIndex]
    : normalQuestions[questionIndex];
  const currentQuestionId = currentQuestion?.id;
  const questionTextActive =
    questionIntroComplete || (phase === "question_active" && transitionPhase === "idle");

  const progressLabel = useMemo(() => {
    if (isFinal) {
      return `Întrebarea finală ${Math.min(finalIndex + 1, 16)} din 16`;
    }

    return `Runda ${round} · Întrebarea ${Math.min(questionIndex + 1, 5)} din 5`;
  }, [finalIndex, isFinal, questionIndex, round]);

  useEffect(() => {
    if (phase !== "question_active" || !questionIntroComplete) return;
    if (secondsLeft <= 0) {
      void handleAnswer(null, true);
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [phase, questionIntroComplete, secondsLeft]);

  useEffect(() => {
    if (phase === "question_active" || phase === "question_answered") {
      emitAudioCue("intro-stop", { sessionId });
    }
  }, [phase, sessionId]);

  useEffect(() => {
    if (phase !== "question_active" || !questionIntroComplete || !currentQuestionId) {
      emitAudioCue("timer-stop");
      timerCueQuestionRef.current = null;
      return;
    }

    if (timerCueQuestionRef.current === currentQuestionId) return;

    timerCueQuestionRef.current = currentQuestionId;
    emitAudioCue("timer-urgent", {
      questionId: currentQuestionId,
      sessionId,
    });
  }, [currentQuestionId, phase, questionIntroComplete, sessionId]);

  useEffect(() => {
    if (
      phase !== "question_active" &&
      phase !== "choosing_category" &&
      phase !== "final_intro" &&
      phase !== "won" &&
      phase !== "lost"
    ) {
      return;
    }

    window.scrollTo({ left: 0, top: 0, behavior: "auto" });
  }, [currentQuestionId, phase]);

  useEffect(() => {
    if (!isLastHeartWarning || phase !== "question_active") {
      if (!isLastHeartWarning) {
        lastHeartCueRef.current = false;
      }
      return;
    }

    if (lastHeartCueRef.current) return;
    lastHeartCueRef.current = true;
    emitAudioCue("final-last-heart", {
      sessionId,
      questionIndex: finalQuestionNumber,
    });
  }, [finalQuestionNumber, isLastHeartWarning, phase, sessionId]);

  useEffect(() => {
    if (!isFinal || phase !== "question_active") return;
    if (finalQuestionNumber !== 13 && finalQuestionNumber !== 16) return;
    if (finalMilestoneCueRef.current.has(finalQuestionNumber)) return;

    finalMilestoneCueRef.current.add(finalQuestionNumber);
    emitAudioCue(finalQuestionNumber === 13 ? "final-question-13" : "final-question-16", {
      sessionId,
      questionIndex: finalQuestionNumber,
    });
  }, [finalQuestionNumber, isFinal, phase, sessionId]);

  function withTransition(children: ReactNode) {
    return (
      <>
        {children}
        <RoundTransitionOverlay
          emptyMessage={transitionMessage}
          heartCount={temporaryHearts}
          phase={transitionPhase}
        />
      </>
    );
  }

  function runRoundTransition(callback: () => void, emptyMessage = "Succes!") {
    if (transitionPhase !== "idle") return;

    setTransitionMessage(emptyMessage);
    setTransitionPhase("covering");
    window.setTimeout(() => {
      callback();
      setTransitionPhase("showing");
      window.setTimeout(() => {
        setTransitionPhase("revealing");
        window.setTimeout(() => {
          setTransitionPhase("idle");
        }, REVEAL_DURATION_MS);
      }, HEART_HOLD_MS);
    }, COVER_DURATION_MS);
  }

  async function refreshCategories() {
    setCategoryOptions(await getCategoryOptionsAction(sessionId));
  }

  const dismissCorrectPopUp = useCallback((id: number) => {
    setCorrectPopUps((items) => items.filter((item) => item.id !== id));
  }, []);

  const handleQuestionRevealComplete = useCallback(() => {
    setQuestionIntroComplete(true);
  }, []);

  function createCorrectPopUp(offset = 0) {
    const anchor = popUpAnchors[Math.floor(Math.random() * popUpAnchors.length)];
    const sequence = popUpSequences[Math.floor(Math.random() * popUpSequences.length)];
    const id = correctPopUpIdRef.current + 1;
    correctPopUpIdRef.current = id;

    setCorrectPopUps((items) => [
      ...items.slice(-1),
      {
        id,
        sequence,
        left: Math.min(92, Math.max(8, anchor.left + (Math.random() - 0.5) * 18)),
        top: Math.min(90, Math.max(14, anchor.top + (Math.random() - 0.5) * 20)),
        rotation: (Math.random() - 0.5) * 18,
        size: 185 + Math.round(Math.random() * 62) + offset,
      },
    ]);
  }

  function triggerCorrectPopUp() {
    correctAnswerCountRef.current += 1;

    createCorrectPopUp();

    if (Math.random() > 0.65) {
      window.setTimeout(() => {
        createCorrectPopUp(-18);
      }, 180);
    }
  }

  async function chooseCategory(category: PublicCategory) {
    if (phase !== "choosing_category") return;

    const prepared = await prepareNormalRoundAction(sessionId, category.id, round);

    runRoundTransition(() => {
      setLastCategory(prepared.categoryName);
      setNormalQuestions(prepared.questions);
      setQuestionIndex(0);
      setFeedback(null);
      setPendingAnswerId(null);
      setSecondsLeft(QUESTION_SECONDS);
      setQuestionIntroComplete(false);
      setPhase("question_active");
    });
  }

  async function startFinalRound() {
    const questions = await prepareFinalRoundAction(sessionId);

    runRoundTransition(() => {
      setFinalQuestions(questions);
      setFinalIndex(0);
      setRound(4);
      setFeedback(null);
      setPendingAnswerId(null);
      setSecondsLeft(QUESTION_SECONDS);
      setQuestionIntroComplete(false);
      setPhase("question_active");
    });
  }

  async function handleAnswer(selectedAnswerId: string | null, timedOut = false) {
    if (!currentQuestion || phase !== "question_active" || !questionIntroComplete) return;

    setFeedback(null);
    setPendingAnswerId(selectedAnswerId);
    setPhase("question_answered");
    emitAudioCue("timer-stop");

    const responseTimeMs = (QUESTION_SECONDS - secondsLeft) * 1000;
    const result: {
      isCorrect: boolean;
      correctAnswerId: string | null;
      lostHeart?: boolean;
      status?: string;
    } = isFinal
      ? await submitFinalAnswerAction(
          sessionId,
          currentQuestion.id,
          selectedAnswerId,
          responseTimeMs,
        )
      : await submitNormalAnswerAction(
          sessionId,
          currentQuestion.id,
          selectedAnswerId,
          responseTimeMs,
        );

    if (!isFinal && result.isCorrect) {
      setTemporaryHearts((value) => value + 1);
      emitAudioCue("normal-correct", {
        sessionId,
        questionId: currentQuestion.id,
      });
    }

    if (result.isCorrect) {
      if (isFinal) {
        emitAudioCue("final-correct", {
          sessionId,
          questionId: currentQuestion.id,
          questionIndex: finalQuestionNumber,
        });
      }
      triggerCorrectPopUp();
    }

    if (!isFinal && !result.isCorrect) {
      emitAudioCue("normal-wrong", {
        sessionId,
        questionId: currentQuestion.id,
      });
    }

    if (isFinal && !result.isCorrect && result.lostHeart) {
      const heartsLeft = Math.max(0, temporaryHearts - 1);
      setLostHeartSignal((value) => value + 1);
      setTemporaryHearts(() => heartsLeft);
      emitAudioCue("final-wrong-heart-lost", {
        sessionId,
        questionId: currentQuestion.id,
        heartsLeft,
      });
    }

    setPendingAnswerId(null);
    setFeedback({
      selectedAnswerId,
      correctAnswerId: result.correctAnswerId,
      correct: result.isCorrect,
      timedOut,
      lostHeart: Boolean(result.lostHeart),
    });

    if (result.status === "won") {
      emitAudioCue("final-won", { sessionId });
      runRoundTransition(() => {
        setPhase("won");
        router.refresh();
      });
    }

    if (result.status === "lost") {
      emitAudioCue("final-wrong-lost", { sessionId });
      runRoundTransition(
        () => {
          setPhase("lost");
          router.refresh();
        },
        "Bravo! Mai încearcă!",
      );
    }
  }

  function advanceAfterNormalRound() {
    runRoundTransition(() => {
      void completeNormalRoundAction(sessionId, round);
      setFeedback(null);
      setPendingAnswerId(null);
      setNormalQuestions([]);

      if (round >= 3) {
        setPhase("final_intro");
        return;
      }

      setRound((value) => value + 1);
      setQuestionIndex(0);
      setPhase("choosing_category");
      void refreshCategories();
    });
  }

  function nextStep() {
    if (isFinal) {
      if (finalIndex >= finalQuestions.length - 1) return;

      setFinalIndex((value) => value + 1);
      setFeedback(null);
      setPendingAnswerId(null);
      setCorrectPopUps([]);
      setSecondsLeft(QUESTION_SECONDS);
      setQuestionIntroComplete(false);
      setPhase("question_active");
      return;
    }

    if (questionIndex < normalQuestions.length - 1) {
      setQuestionIndex((value) => value + 1);
      setFeedback(null);
      setPendingAnswerId(null);
      setCorrectPopUps([]);
      setSecondsLeft(QUESTION_SECONDS);
      setQuestionIntroComplete(false);
      setPhase("question_active");
      return;
    }

    advanceAfterNormalRound();
  }

  if (phase === "choosing_category") {
    return withTransition(
      <div className="flex flex-1 flex-col items-center justify-center text-center lg:pb-20">
        <p className="text-[16px] font-extrabold uppercase text-stiucastiiOrange sm:text-[18px]">
          Runda {round} din 3
        </p>
        <h1 className="mt-2 text-[30px] font-extrabold leading-tight sm:text-[36px]">
          Alege o categorie
        </h1>
        <p className="mt-3 max-w-[580px] text-[17px] font-bold leading-snug sm:text-[20px]">
          Fiecare rundă are 5 întrebări și 30 de secunde pentru răspuns.
          <br />
          Pentru fiecare răspuns corect primești o inimă.
        </p>
        <div className="mt-5 sm:mt-6">
          <PlayerStatus
            color={playerHeartColor}
            hearts={temporaryHearts}
            lostHeartSignal={lostHeartSignal}
            name={playerName}
            urgentLastHeart={isLastHeartWarning}
          />
        </div>

        {categoryOptions.length > 0 ? (
          <div className="mt-7 grid w-full max-w-[688px] grid-cols-1 gap-x-[18px] gap-y-[20px] sm:mt-9 sm:grid-cols-2 sm:gap-y-[26px] lg:grid-cols-3">
            {categoryOptions.map((category) => (
              <button
                className="block w-full border-0 bg-transparent p-0"
                key={category.id}
                onClick={() => chooseCategory(category)}
              >
                <CategoryDrawer asButton name={category.name} />
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-8 max-w-[620px] rounded-[16px] border-2 border-stiucastiiBlue/25 bg-stiucastiiBlue/10 px-6 py-5 text-[18px] font-bold leading-snug text-stiucastiiDark">
            Nu mai sunt categorii cu suficiente întrebări disponibile pentru
            sesiunea curentă. Pornește un joc nou sau adaugă întrebări în admin.
          </div>
        )}
      </div>,
    );
  }

  if (phase === "loading_round") {
    return withTransition(<div className="flex flex-1" />);
  }

  if (phase === "final_intro") {
    return withTransition(
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <MovingBallsTitle title="Runda finală" />
        <div className="mt-6 sm:mt-8">
          <PlayerStatus
            color={playerHeartColor}
            hearts={temporaryHearts}
            lostHeartSignal={lostHeartSignal}
            name={playerName}
            urgentLastHeart={isLastHeartWarning}
          />
        </div>
        <p className="mt-6 max-w-[560px] text-[19px] font-bold leading-snug sm:mt-8 sm:text-[24px]">
          Urmează 16 întrebări. Fiecare greșeală sau timeout consumă o inimă.
          Dacă nu mai ai inimi și greșești, jocul se termină.
        </p>
        <AppButton className="mt-7 sm:mt-8" onClick={startFinalRound}>
          Start finală
        </AppButton>
      </div>,
    );
  }

  if (phase === "won" || phase === "lost") {
    const won = phase === "won";

    return withTransition(
      <div
        className={cn(
          "result-screen flex flex-1 flex-col items-center justify-center pb-6 text-center sm:pb-8",
          won ? "result-screen-won" : "result-screen-lost",
        )}
      >
        <PlayerStatus
          color={playerHeartColor}
          hearts={temporaryHearts}
          lostHeartSignal={lostHeartSignal}
          name={playerName}
          urgentLastHeart={isLastHeartWarning}
        />
        <div className="result-heart-wrap mt-6 sm:mt-8">
          <span aria-hidden="true" className="result-heart-halo" />
          {won
            ? Array.from({ length: 10 }).map((_, index) => (
                <span
                  aria-hidden="true"
                  className="result-heart-spark"
                  key={index}
                  style={
                    {
                      "--spark-index": index,
                    } as CSSProperties
                  }
                />
              ))
            : null}
          <Heart
            className={cn("relative z-10 result-heart", !won && "grayscale")}
            color={playerHeartColor}
            size="large"
          />
        </div>
        <h1 className="mt-5 text-[25px] font-extrabold leading-tight sm:text-[28px]">
          {won ? `Felicitări, ${playerName}!` : `Ai fost foarte aproape, ${playerName}!`}
          <br />
          {won ? "Ai câștigat inima jocului!" : "Ai rămas fără inimi în finală."}
        </h1>
        <p className="mt-5 max-w-[500px] text-[18px] leading-snug sm:mt-7 sm:text-[21px]">
          {won
            ? "Ai primit încă o inimă în Clasamentul inimilor. Joacă din nou pentru a câștiga încă una."
            : "Joacă din nou, câștigă mai multe inimi în rundele normale și încearcă să ajungi la final."}
        </p>
        <p className="mt-6 text-[22px] font-extrabold sm:mt-7 sm:text-[25px]">Cu mintea câștigi inimi!</p>
        <AppButton className="mb-8 mt-7 sm:mt-8 lg:mb-0" href="/play/nickname">
          Joacă din nou
        </AppButton>
      </div>,
    );
  }

  if (!currentQuestion) {
    return withTransition(
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="text-[30px] font-extrabold">Nu sunt întrebări disponibile.</h1>
        <AppButton className="mt-8" onClick={advanceAfterNormalRound}>
          Continuă
        </AppButton>
      </div>,
    );
  }

  return withTransition(
    <>
      <div className="grid w-full grid-cols-[1fr_auto] items-start gap-3 sm:gap-4">
        <PlayerStatus
          color={playerHeartColor}
          hearts={temporaryHearts}
          lostHeartSignal={lostHeartSignal}
          name={playerName}
          urgentLastHeart={isLastHeartWarning}
        />
        <div className="block">
          <TimerCapsule urgent={secondsLeft <= 10} value={formatTime(secondsLeft)} />
        </div>
      </div>

      <div className="mt-7 sm:mt-8">
        <MovingBallsTitle title={isFinal ? "Runda finală" : lastCategory} />
        {isFinal ? <FinalRoundProgress current={finalQuestionNumber} /> : null}
      </div>

      <section
        className={cn(
          "mt-5 flex w-full flex-col items-center text-center sm:mt-6",
          isFinal && "final-tension-surface",
          isFinal && finalQuestionNumber >= 5 && finalQuestionNumber < 9 && "final-tension-low",
          isFinal && finalQuestionNumber >= 9 && finalQuestionNumber < 13 && "final-tension-medium",
          isFinal && finalQuestionNumber >= 13 && "final-tension-high",
        )}
      >
        <p className="mb-3 text-[15px] font-extrabold uppercase text-stiucastiiOrange sm:text-[17px]">
          {progressLabel}
        </p>
        <BouncyQuestionText
          active={questionTextActive}
          className="max-w-[620px] text-[22px] font-bold leading-tight text-[#00518f] sm:text-[25px]"
          key={currentQuestion.id}
          onRevealComplete={handleQuestionRevealComplete}
          text={currentQuestion.text}
        />
        {currentQuestion.imageUrl ? (
          <img
            alt={currentQuestion.text}
            className="mt-4 h-[148px] w-full max-w-[390px] rounded-[12px] object-cover shadow-soft sm:h-[210px]"
            src={currentQuestion.imageUrl}
          />
        ) : null}

        <div className="relative mt-6 w-full max-w-[650px] sm:mt-8">
          <div className="grid w-full grid-cols-1 gap-x-6 gap-y-[14px] sm:grid-cols-2 sm:gap-y-[18px]">
            {currentQuestion.answers.map((answer) => {
              const selected = feedback?.selectedAnswerId === answer.id;
              const correct = feedback?.correctAnswerId === answer.id;
              const pending = pendingAnswerId === answer.id && !feedback;
              const hasFeedback = phase === "question_answered" && Boolean(feedback);
              const showCorrectState = hasFeedback && selected && correct;
              const showWrongState = hasFeedback && selected && !correct;

              return (
                <AnswerButton
                  disabled={phase !== "question_active" || !questionIntroComplete}
                  key={answer.id}
                  onClick={() => handleAnswer(answer.id)}
                  state={
                    pending
                      ? "pending"
                      : showCorrectState
                        ? "correct"
                        : showWrongState
                          ? "wrong"
                          : "idle"
                  }
                >
                  {answer.text}
                </AnswerButton>
              );
            })}
          </div>
        </div>

        {feedback ? (
          <div className="relative mt-3 flex min-h-[136px] w-full max-w-[650px] flex-col items-center overflow-visible pt-1 sm:mt-5 sm:min-h-[220px] sm:pt-3">
            {correctPopUps.map((popUp) => (
              <CorrectAnswerPopUp
                id={popUp.id}
                key={popUp.id}
                left={popUp.left}
                onDone={dismissCorrectPopUp}
                rotation={popUp.rotation}
                sequence={popUp.sequence}
                size={popUp.size}
                top={popUp.top}
              />
            ))}
            <p
              className={cn(
                "relative z-10 text-[19px] font-extrabold leading-tight sm:text-[22px]",
                feedback.correct ? "text-stiucastiiBlue" : "text-stiucastiiOrange",
              )}
            >
              {feedback.timedOut
                ? "Timpul a expirat."
                : feedback.correct
                  ? isFinal
                    ? "Corect. Continui finala!"
                    : "Corect. Ai câștigat o inimă!"
                  : feedback.lostHeart
                    ? "Greșit. Ai pierdut o inimă, dar continui."
                    : "Greșit."}
            </p>
            <AppButton
              className="relative z-10 mt-3 max-w-[220px] text-[21px] sm:mt-4 sm:text-[22px]"
              onClick={nextStep}
            >
              Continuă
            </AppButton>
          </div>
        ) : null}
      </section>
    </>,
  );
}
