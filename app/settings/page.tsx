import { SlidersHorizontal, UserRound } from "lucide-react";
import { AudioSettingsPanel } from "@/components/audio/AudioSettingsPanel";
import { AppButton } from "@/components/layout/AppButton";
import { GameShell } from "@/components/layout/GameShell";

export const dynamic = "force-dynamic";

const settingsCards = [
  {
    title: "Complexitatea întrebărilor",
    text: "Alege ritmul potrivit pentru joc: normal, mai ușor sau provocare. Pentru MVP, dificultatea rămâne controlată de rundă.",
    icon: SlidersHorizontal,
  },
  {
    title: "Cont și player",
    text: "Gestionează numele de player și vezi culoarea inimii legată de acest nume.",
    icon: UserRound,
  },
];

export default function SettingsPage() {
  return (
    <GameShell confirmExit={false}>
      <section className="flex w-full flex-1 flex-col items-center justify-center py-8 text-center">
        <p className="text-[18px] font-extrabold uppercase text-stiucastiiOrange">
          Meniu joc
        </p>
        <h1 className="mt-2 text-[38px] font-extrabold leading-tight">
          Setări
        </h1>
        <p className="mt-3 max-w-[560px] text-[20px] font-bold leading-snug">
          Aici stau opțiunile pentru experiența jucătorului, nu administrarea
          întrebărilor.
        </p>

        <div className="mt-9 grid w-full gap-5">
          <AudioSettingsPanel />

          {settingsCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                className="rounded-[18px] border-2 border-stiucastiiBlue bg-white p-5 text-left shadow-soft"
                key={card.title}
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-stiucastiiBlue text-white">
                    <Icon aria-hidden="true" size={26} strokeWidth={3} />
                  </span>
                  <div>
                    <h2 className="text-[24px] font-extrabold text-stiucastiiBlue">
                      {card.title}
                    </h2>
                    <p className="mt-2 text-[18px] font-semibold leading-snug text-stiucastiiDark/80">
                      {card.text}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <AppButton className="mt-8 text-[22px]" href="/play/nickname">
          Înapoi la joc
        </AppButton>
      </section>
    </GameShell>
  );
}
