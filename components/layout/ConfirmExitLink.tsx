"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

type ConfirmExitLinkProps = {
  children: ReactNode;
  href: string;
  className?: string;
  label: string;
};

export function ConfirmExitLink({
  children,
  href,
  className,
  label,
}: ConfirmExitLinkProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function confirmExit() {
    window.dispatchEvent(
      new CustomEvent("stiucastii:audio-cue", {
        detail: { cue: "timer-stop" },
      }),
    );
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <button
        aria-label={label}
        className={className}
        onClick={() => setOpen(true)}
        type="button"
      >
        {children}
      </button>

      {open ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-stiucastiiBlue/20 px-5 backdrop-blur-sm"
          role="dialog"
        >
          <div className="w-full max-w-[500px] rounded-[22px] border-2 border-stiucastiiBlue bg-white px-7 py-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-stiucastiiOrange text-[38px] font-extrabold text-white">
              !
            </div>
            <h2 className="text-[30px] font-extrabold leading-tight text-stiucastiiDark">
              Atenție!
            </h2>
            <p className="mx-auto mt-4 max-w-[390px] text-[20px] font-semibold leading-snug text-stiucastiiDark/80">
              Vei pierde tot progresul din jocul curent, iar jocul va fi
              întrerupt.
            </p>
            <p className="mt-3 text-[21px] font-extrabold text-stiucastiiBlue">
              Ești sigur că vrei să revii la prima pagină?
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                className="inline-flex h-12 min-w-[170px] items-center justify-center rounded-[14px] bg-stiucastiiBlue px-5 text-[20px] font-extrabold uppercase leading-none text-white shadow-game transition hover:-translate-y-0.5 active:translate-y-0"
                onClick={confirmExit}
                type="button"
              >
                Da, ies
              </button>
              <button
                className="inline-flex h-12 min-w-[170px] items-center justify-center rounded-[14px] border-[3px] border-stiucastiiBlue bg-white px-5 text-[20px] font-extrabold uppercase leading-none text-stiucastiiBlue shadow-game transition hover:-translate-y-0.5 active:translate-y-0"
                onClick={() => setOpen(false)}
                type="button"
              >
                Rămân în joc
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
