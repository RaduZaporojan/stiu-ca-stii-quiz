import { Heart } from "@/components/game/Heart";
import { PlayerStatus } from "@/components/game/PlayerStatus";
import { GameShell } from "@/components/layout/GameShell";
import { AppButton } from "@/components/layout/AppButton";

export const dynamic = "force-dynamic";

export default function ResultPage() {
  return (
    <GameShell>
      <PlayerStatus hearts={3} name="PlayerName" />
      <section className="flex flex-1 flex-col items-center justify-center pb-10 text-center">
        <Heart color="orange" size="large" />
        <h1 className="mt-5 text-[26px] font-extrabold leading-tight">
          Felicitări, Ionel!
          <br />
          Ai câștigat inima jocului!
        </h1>
        <p className="mt-8 max-w-[430px] text-[20px] leading-snug">
          Acum faci parte din <strong>Clasamentul inimilor.</strong>
          <br />
          <strong className="text-[#00518f]">Joacă din nou</strong> pentru a
          acumula cât mai multe inimi.
          <br />
          Și nu uita...
        </p>
        <p className="mt-8 text-[25px] font-extrabold">Cu mintea câștigi inimi!</p>
        <AppButton className="mt-8 text-[22px]" href="/play/categories">
          Joacă din nou
        </AppButton>
      </section>
    </GameShell>
  );
}
