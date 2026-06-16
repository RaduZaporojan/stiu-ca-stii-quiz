"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnswerButton } from "@/components/game/AnswerButton";
import { CategoryDrawer } from "@/components/game/CategoryDrawer";
import { Heart } from "@/components/game/Heart";
import { MovingBallsTitle } from "@/components/game/MovingBallsTitle";
import { PlayerStatus } from "@/components/game/PlayerStatus";
import {
  RoundTransitionOverlay,
  type RoundTransitionPhase,
} from "@/components/game/RoundTransitionOverlay";
import { TimerCapsule } from "@/components/game/TimerCapsule";
import { AppButton } from "@/components/layout/AppButton";
import {
  getRandomPlayableCategories,
  getFinalQuestions,
  getNormalQuestions,
  shuffle,
  type QuizQuestion,
} from "@/lib/question-bank";
import { cn } from "@/lib/utils";

type Phase =
  | "choosing_category"
  | "question_active"
  | "question_answered"
  | "round_completed"
  | "final_intro"
  | "won"
  | "lost";

type Feedback = {
  selectedAnswerId: string | null;
  correct: boolean;
  timedOut?: boolean;
  lostHeart?: boolean;
};

type PlayableGameProps = {
  playerName?: string;
  playerHeartColor?: "orange" | "blue";
};

const QUESTION_SECONDS = 30;
const COVER_DURATION_MS = 860;
const HEART_HOLD_MS = 900;
const REVEAL_DURATION_MS = 860;

function formatTime(seconds: number) {
  return `00:${String(seconds).padStart(2, "0")}`;
}

function withShuffledAnswers(question: QuizQuestion): QuizQuestion {
  return {
    ...question,
    answers: shuffle(question.answers),
  };
}

export function PlayableGame({
  playerName = "PlayerName",
  playerHeartColor = "orange",
}: PlayableGameProps) {
  const [phase, setPhase] = useState<Phase>("choosing_category");
  const [round, setRound] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [finalIndex, setFinalIndex] = useState(0);
  const [normalQuestions, setNormalQuestions] = useState<QuizQuestion[]>([]);
  const [finalQuestions, setFinalQuestions] = useState<QuizQuestion[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [temporaryHearts, setTemporaryHearts] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_SECONDS);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [lastCategory, setLastCategory] = useState<string>("CASCADĂ");
  const [categoryOptions, setCategoryOptions] = useState<string[]>(() =>
    getRandomPlayableCategories(6),
  );
  const [transitionPhase, setTransitionPhase] =
    useState<RoundTransitionPhase>("idle");

  const isFinal = finalQuestions.length > 0 && round > 3;
  const currentQuestion = isFinal
    ? finalQuestions[finalIndex]
    : normalQuestions[questionIndex];

  const progressLabel = useMemo(() => {
    if (isFinal) {
      return `Întrebarea finală ${Math.min(finalIndex + 1, 16)} din 16`;
    }

    return `Runda ${round} · Întrebarea ${Math.min(questionIndex + 1, 5)} din 5`;
  }, [finalIndex, isFinal, questionIndex, round]);

  useEffect(() => {
    if (phase !== "question_active") return;
    if (secondsLeft <= 0) {
      handleAnswer(null, true);
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [phase, secondsLeft]);

  function withTransition(children: ReactNode) {
    return (
      <>
        {children}
        <RoundTransitionOverlay
          heartCount={temporaryHearts}
          phase={transitionPhase}
        />
      </>
    );
  }

  function runRoundTransition(callback: () => void) {
    if (transitionPhase !== "idle") return;

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

  function chooseCategory(category: string) {
    runRoundTransition(() => {
      const selected = getNormalQuestions(category, round, usedQuestionIds).map(
        withShuffledAnswers,
      );

      setLastCategory(category);
      setNormalQuestions(selected);
      setUsedQuestionIds((ids) => [
        ...ids,
        ...selected.map((question) => question.id),
      ]);
      setQuestionIndex(0);
      setFeedback(null);
      setSecondsLeft(QUESTION_SECONDS);
      setPhase("question_active");
    });
  }

  function startFinalRound() {
    runRoundTransition(() => {
      const selected = getFinalQuestions(usedQuestionIds);

      setFinalQuestions(selected);
      setUsedQuestionIds((ids) => [
        ...ids,
        ...selected.map((question) => question.id),
      ]);
      setFinalIndex(0);
      setRound(4);
      setFeedback(null);
      setSecondsLeft(QUESTION_SECONDS);
      setPhase("question_active");
    });
  }

  function handleAnswer(selectedAnswerId: string | null, timedOut = false) {
    if (!currentQuestion || phase !== "question_active") return;

    const correct = selectedAnswerId === currentQuestion.correctAnswerId;
    let lostHeart = false;

    if (!isFinal && correct) {
      setTemporaryHearts((value) => value + 1);
    }

    if (isFinal && !correct) {
      if (temporaryHearts > 0) {
        lostHeart = true;
        setTemporaryHearts((value) => Math.max(0, value - 1));
      } else {
        setFeedback({ selectedAnswerId, correct, timedOut, lostHeart: false });
        runRoundTransition(() => setPhase("lost"));
        return;
      }
    }

    setFeedback({ selectedAnswerId, correct, timedOut, lostHeart });
    setPhase("question_answered");
  }

  function nextStep() {
    if (isFinal) {
      if (finalIndex >= 15) {
        runRoundTransition(() => setPhase("won"));
        return;
      }

      setFinalIndex((value) => value + 1);
      setFeedback(null);
      setSecondsLeft(QUESTION_SECONDS);
      setPhase("question_active");
      return;
    }

    if (questionIndex < normalQuestions.length - 1) {
      setQuestionIndex((value) => value + 1);
      setFeedback(null);
      setSecondsLeft(QUESTION_SECONDS);
      setPhase("question_active");
      return;
    }

    runRoundTransition(() => setPhase("round_completed"));
  }

  function continueAfterRound() {
    if (round >= 3) {
      runRoundTransition(() => setPhase("final_intro"));
      return;
    }

    runRoundTransition(() => {
      setRound((value) => value + 1);
      setCategoryOptions(getRandomPlayableCategories(6));
      setFeedback(null);
      setPhase("choosing_category");
    });
  }

  function restartGame() {
    runRoundTransition(() => {
      setPhase("choosing_category");
      setRound(1);
      setQuestionIndex(0);
      setFinalIndex(0);
      setNormalQuestions([]);
      setFinalQuestions([]);
      setUsedQuestionIds([]);
      setTemporaryHearts(0);
      setCategoryOptions(getRandomPlayableCategories(6));
      setSecondsLeft(QUESTION_SECONDS);
      setFeedback(null);
      setLastCategory("CASCADĂ");
    });
  }

  if (phase === "choosing_category") {
    return withTransition(
      <div className="flex flex-1 flex-col items-center justify-start pt-4 text-center sm:justify-center sm:pt-0 lg:pb-20">
        <p className="text-[14px] font-extrabold uppercase text-stiucastiiOrange sm:text-[18px]">
          Runda {round} din 3
        </p>
        <h1 className="mt-1 text-[28px] font-extrabold leading-tight sm:mt-2 sm:text-[36px]">
          Alege o categorie
        </h1>
        <p className="mt-2 max-w-[360px] text-[15px] font-bold leading-snug sm:mt-3 sm:max-w-[580px] sm:text-[20px]">
          Fiecare rundă are 5 întrebări și 30 de secunde pentru răspuns.
          <br />
          Pentru fiecare răspuns corect primești o inimă.
        </p>
        <div className="mt-4 sm:mt-6">
          <PlayerStatus
            color={playerHeartColor}
            hearts={temporaryHearts}
            name={playerName}
          />
        </div>

        <div className="mt-4 grid w-full max-w-[688px] grid-cols-1 gap-x-[18px] gap-y-[14px] sm:mt-9 sm:grid-cols-2 sm:gap-y-[26px] lg:grid-cols-3">
          {categoryOptions.map((category) => (
            <button
              className="block w-full border-0 bg-transparent p-0"
              key={category}
              onClick={() => chooseCategory(category)}
            >
              <CategoryDrawer asButton name={category} />
            </button>
          ))}
        </div>
      </div>,
    );
  }

  if (phase === "round_completed") {
    return withTransition(
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <MovingBallsTitle title={`Runda ${round} completă`} />
        <div className="mt-8">
          <PlayerStatus
            color={playerHeartColor}
            hearts={temporaryHearts}
            name={playerName}
          />
        </div>
        <p className="mt-8 max-w-[520px] text-[24px] font-bold leading-snug">
          Ai terminat categoria {lastCategory}. Inimile câștigate devin vieți
          pentru runda finală.
        </p>
        <AppButton className="mt-8" onClick={continueAfterRound}>
          {round >= 3 ? "Intră în finală" : "Alege categoria"}
        </AppButton>
      </div>,
    );
  }

  if (phase === "final_intro") {
    return withTransition(
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <MovingBallsTitle title="Runda finală" />
        <div className="mt-8">
          <PlayerStatus
            color={playerHeartColor}
            hearts={temporaryHearts}
            name={playerName}
          />
        </div>
        <p className="mt-8 max-w-[560px] text-[24px] font-bold leading-snug">
          Urmează 16 întrebări. Fiecare greșeală sau timeout consumă o inimă.
          Dacă nu mai ai inimi și greșești, jocul se termină.
        </p>
        <AppButton className="mt-8" onClick={startFinalRound}>
          Start finală
        </AppButton>
      </div>,
    );
  }

  if (phase === "won" || phase === "lost") {
    const won = phase === "won";

    return withTransition(
      <div className="flex flex-1 flex-col items-center justify-center pb-8 text-center">
        <PlayerStatus
          color={playerHeartColor}
          hearts={temporaryHearts}
          name={playerName}
        />
        <Heart
          className={cn("mt-8", !won && "grayscale")}
          color={playerHeartColor}
          size="large"
        />
        <h1 className="mt-5 text-[28px] font-extrabold leading-tight">
          {won
            ? `Felicitări, ${playerName}!`
            : `Ai fost foarte aproape, ${playerName}!`}
          <br />
          {won ? "Ai câștigat inima jocului!" : "Ai rămas fără inimi în finală."}
        </h1>
        <p className="mt-7 max-w-[500px] text-[21px] leading-snug">
          {won
            ? "Ai primit încă o inimă în Clasamentul inimilor. Joacă din nou pentru a câștiga încă una."
            : "Joacă din nou, câștigă mai multe inimi în rundele normale și încearcă să ajungi la final."}
        </p>
        <p className="mt-7 text-[25px] font-extrabold">Cu mintea câștigi inimi!</p>
        <AppButton className="mt-8" onClick={restartGame}>
          Joacă din nou
        </AppButton>
      </div>,
    );
  }

  if (!currentQuestion) {
    return withTransition(
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="text-[30px] font-extrabold">
          Nu sunt întrebări disponibile.
        </h1>
        <AppButton className="mt-8" onClick={restartGame}>
          Reîncepe
        </AppButton>
      </div>,
    );
  }

  return withTransition(
    <>
      <div className="grid w-full grid-cols-[1fr_auto] items-start gap-4">
        <PlayerStatus
          color={playerHeartColor}
          hearts={temporaryHearts}
          name={playerName}
        />
        <div className="hidden lg:block">
          <TimerCapsule urgent={secondsLeft <= 10} value={formatTime(secondsLeft)} />
        </div>
      </div>

      <div className="mt-7 lg:hidden">
        <TimerCapsule urgent={secondsLeft <= 10} value={formatTime(secondsLeft)} />
      </div>

      <div className="mt-8">
        <MovingBallsTitle title={isFinal ? "Runda finală" : currentQuestion.category} />
      </div>

      <section className="mt-6 flex w-full flex-col items-center text-center">
        <p className="mb-3 text-[17px] font-extrabold uppercase text-stiucastiiOrange">
          {progressLabel}
        </p>
        <h1 className="max-w-[620px] text-[25px] font-bold leading-tight text-[#00518f]">
          {currentQuestion.text}
        </h1>
        {currentQuestion.imageUrl ? (
          <img
            alt={currentQuestion.imageAlt ?? currentQuestion.text}
            className="mt-4 h-[170px] w-full max-w-[390px] rounded-[12px] object-cover shadow-soft sm:h-[210px]"
            src={currentQuestion.imageUrl}
          />
        ) : null}

        <div className="mt-8 grid w-full max-w-[608px] grid-cols-1 gap-x-6 gap-y-[18px] sm:grid-cols-2">
            {currentQuestion.answers.map((answer) => {
              const selected = feedback?.selectedAnswerId === answer.id;
              const correct = currentQuestion.correctAnswerId === answer.id;
              const showCorrectState = phase === "question_answered" && selected && correct;
              const showWrongState = phase === "question_answered" && selected && !correct;

              return (
                <AnswerButton
                disabled={phase !== "question_active"}
                key={answer.id}
                onClick={() => handleAnswer(answer.id)}
                  state={
                    showCorrectState
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

        {phase === "question_answered" ? (
          <div className="mt-6 flex flex-col items-center">
            <p
              className={cn(
                "text-[22px] font-extrabold",
                feedback?.correct ? "text-stiucastiiBlue" : "text-stiucastiiOrange",
              )}
            >
              {feedback?.timedOut
                ? "Timpul a expirat."
                : feedback?.correct
                  ? isFinal
                    ? "Corect. Continui finala!"
                    : "Corect. Ai câștigat o inimă!"
                  : feedback?.lostHeart
                    ? "Greșit. Ai pierdut o inimă, dar continui."
                    : "Greșit."}
            </p>
            <AppButton className="mt-4 min-w-[220px] text-[22px]" onClick={nextStep}>
              Continuă
            </AppButton>
          </div>
        ) : null}
      </section>
    </>,
  );
}
