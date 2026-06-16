import { AnswerButton } from "@/components/game/AnswerButton";
import { MovingBallsTitle } from "@/components/game/MovingBallsTitle";
import { PlayerStatus } from "@/components/game/PlayerStatus";
import { TimerCapsule } from "@/components/game/TimerCapsule";
import { GameShell } from "@/components/layout/GameShell";
import { answers } from "@/lib/demo-data";

export default function FinalRoundPage() {
  return (
    <GameShell>
      <div className="grid w-full grid-cols-[1fr_auto] items-start gap-4">
        <PlayerStatus hearts={6} />
        <div className="hidden lg:block">
          <TimerCapsule />
        </div>
      </div>

      <div className="mt-7 lg:hidden">
        <TimerCapsule />
      </div>

      <div className="mt-12">
        <MovingBallsTitle title="Runda finală" />
      </div>

      <section className="mt-10 flex w-full flex-col items-center text-center">
        <p className="text-[18px] font-bold uppercase tracking-normal text-stiucastiiOrange">
          Întrebarea 7 din 16
        </p>
        <h1 className="mt-3 max-w-[560px] text-[28px] font-extrabold leading-tight text-[#00518f]">
          Care personalitate a culturii românești este asociată cu această
          operă?
        </h1>
        <div className="mt-12 grid w-full max-w-[608px] grid-cols-1 gap-x-6 gap-y-[22px] sm:grid-cols-2">
          {answers.map((answer) => (
            <AnswerButton key={answer}>{answer}</AnswerButton>
          ))}
        </div>
      </section>
    </GameShell>
  );
}
