import { Heart } from "@/components/game/Heart";
import { PlayerStatus } from "@/components/game/PlayerStatus";
import { GameShell } from "@/components/layout/GameShell";
import { AppButton } from "@/components/layout/AppButton";

export const dynamic = "force-dynamic";

export default function LostPage() {
  return (
    <GameShell>
      <PlayerStatus hearts={0} name="PlayerName" />
      <section className="flex flex-1 flex-col items-center justify-center pb-10 text-center">
        <Heart className="opacity-80 grayscale" color="orange" size="large" />
        <h1 className="mt-5 text-[26px] font-extrabold leading-tight">
          Ai fost foarte aproape, Ionel!
        </h1>
        <p className="mt-8 max-w-[460px] text-[20px] leading-snug">
          Ai rămas fără inimi în runda finală.
          <br />
          Joacă din nou, câștigă mai multe inimi în rundele normale și încearcă
          să ajungi la final.
        </p>
        <p className="mt-8 text-[25px] font-extrabold">Cu mintea câștigi inimi!</p>
        <AppButton className="mt-8 text-[22px]" href="/play/categories">
          Joacă din nou
        </AppButton>
      </section>
    </GameShell>
  );
}
