"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const mutedKey = "stiucastii-audio-muted";
const effectsVolumeKey = "stiucastii-audio-effects-volume";
const timerVolumeKey = "stiucastii-audio-timer-volume";

function readVolume(key: string, fallback: number) {
  if (typeof window === "undefined") return fallback;

  const value = Number(window.localStorage.getItem(key));
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : fallback;
}

export function AudioSettingsPanel() {
  const [muted, setMuted] = useState(false);
  const [effectsVolume, setEffectsVolume] = useState(55);
  const [timerVolume, setTimerVolume] = useState(28);

  useEffect(() => {
    setMuted(window.localStorage.getItem(mutedKey) === "true");
    setEffectsVolume(readVolume(effectsVolumeKey, 55));
    setTimerVolume(readVolume(timerVolumeKey, 28));
  }, []);

  function persist(nextMuted: boolean, nextEffects: number, nextTimer: number) {
    window.localStorage.setItem(mutedKey, String(nextMuted));
    window.localStorage.setItem(effectsVolumeKey, String(nextEffects));
    window.localStorage.setItem(timerVolumeKey, String(nextTimer));
    window.dispatchEvent(
      new CustomEvent("stiucastii:audio-settings", {
        detail: {
          effectsVolume: nextEffects,
          muted: nextMuted,
          timerVolume: nextTimer,
        },
      }),
    );
  }

  function toggleMute() {
    const nextMuted = !muted;
    setMuted(nextMuted);
    persist(nextMuted, effectsVolume, timerVolume);
  }

  function updateEffectsVolume(value: number) {
    setEffectsVolume(value);
    persist(muted, value, timerVolume);
  }

  function updateTimerVolume(value: number) {
    setTimerVolume(value);
    persist(muted, effectsVolume, value);
  }

  function testCorrectSound() {
    window.dispatchEvent(
      new CustomEvent("stiucastii:audio-cue", {
        detail: { cue: "normal-correct" },
      }),
    );
  }

  return (
    <section className="rounded-[18px] border-2 border-stiucastiiBlue bg-white p-5 text-left shadow-soft">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-stiucastiiBlue text-white">
          {muted ? (
            <VolumeX aria-hidden="true" size={26} strokeWidth={3} />
          ) : (
            <Volume2 aria-hidden="true" size={26} strokeWidth={3} />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-[24px] font-extrabold text-stiucastiiBlue">
                Sunet și feedback
              </h2>
              <p className="mt-2 text-[18px] font-semibold leading-snug text-stiucastiiDark/80">
                Controlează sunetele jocului fără să oprești animațiile.
              </p>
            </div>
            <button
              aria-pressed={muted}
              className="inline-flex h-11 min-w-[120px] items-center justify-center rounded-[12px] bg-stiucastiiBlue px-4 text-[16px] font-extrabold uppercase text-white shadow-game transition hover:-translate-y-0.5"
              onClick={toggleMute}
              type="button"
            >
              {muted ? "Pornește" : "Mute"}
            </button>
          </div>

          <div className="mt-6 grid gap-5">
            <label className="block">
              <span className="flex items-center justify-between text-[16px] font-extrabold text-stiucastiiDark">
                <span>Efecte răspuns</span>
                <span>{effectsVolume}%</span>
              </span>
              <input
                className="audio-range mt-2"
                max="100"
                min="0"
                onChange={(event) => updateEffectsVolume(Number(event.target.value))}
                type="range"
                value={effectsVolume}
              />
            </label>

            <label className="block">
              <span className="flex items-center justify-between text-[16px] font-extrabold text-stiucastiiDark">
                <span>Timer</span>
                <span>{timerVolume}%</span>
              </span>
              <input
                className="audio-range mt-2"
                max="100"
                min="0"
                onChange={(event) => updateTimerVolume(Number(event.target.value))}
                type="range"
                value={timerVolume}
              />
            </label>
          </div>

          <button
            className="mt-6 inline-flex h-11 items-center justify-center rounded-[12px] border-2 border-stiucastiiBlue px-5 text-[16px] font-extrabold uppercase text-stiucastiiBlue transition hover:bg-stiucastiiBlue hover:text-white"
            onClick={testCorrectSound}
            type="button"
          >
            Test sunet
          </button>
        </div>
      </div>
    </section>
  );
}
