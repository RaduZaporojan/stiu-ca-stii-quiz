"use client";

import { Volume2, VolumeX } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

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

const soundMap: Partial<Record<AudioCue, string>> = {
  "intro-start": "/audio/intro-game-music.wav",
  "normal-correct": "/audio/correct.mp3",
  "normal-wrong": "/audio/wrong.mp3",
  "final-correct": "/audio/correct.mp3",
  "final-wrong-heart-lost": "/audio/wrong.mp3",
  "final-wrong-lost": "/audio/wrong.mp3",
  "timer-urgent": "/audio/timer-watch.wav",
};

export function AudioFeedbackProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const audioRefs = useRef<Partial<Record<AudioCue, HTMLAudioElement>>>({});
  const introFadeRef = useRef<number | null>(null);
  const unlockedRef = useRef(false);
  const mutedRef = useRef(false);
  const effectsVolumeRef = useRef(55);
  const timerVolumeRef = useRef(28);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const storedMute = window.localStorage.getItem("stiucastii-audio-muted");
    const nextMuted = storedMute === "true";
    const storedEffectsVolume = Number(
      window.localStorage.getItem("stiucastii-audio-effects-volume"),
    );
    const storedTimerVolume = Number(
      window.localStorage.getItem("stiucastii-audio-timer-volume"),
    );

    mutedRef.current = nextMuted;
    effectsVolumeRef.current = Number.isFinite(storedEffectsVolume)
      ? Math.min(100, Math.max(0, storedEffectsVolume))
      : 55;
    timerVolumeRef.current = Number.isFinite(storedTimerVolume)
      ? Math.min(100, Math.max(0, storedTimerVolume))
      : 28;
    setMuted(nextMuted);
  }, []);

  useEffect(() => {
    const unlockAudio = () => {
      unlockedRef.current = true;
      if (isIntroPath(pathname)) {
        playIntro();
      }
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, [pathname]);

  useEffect(() => {
    stopNonIntroAudio();

    if (isIntroPath(pathname)) {
      playIntro();
      return;
    }

    if (!pathname?.startsWith("/play/session")) {
      fadeOutIntro();
    }
  }, [pathname]);

  useEffect(() => {
    const applySettings = (
      settings: Partial<{
        effectsVolume: number;
        muted: boolean;
        timerVolume: number;
      }>,
    ) => {
      if (typeof settings.muted === "boolean") {
        mutedRef.current = settings.muted;
        setMuted(settings.muted);
      }

      if (typeof settings.effectsVolume === "number") {
        effectsVolumeRef.current = Math.min(100, Math.max(0, settings.effectsVolume));
      }

      if (typeof settings.timerVolume === "number") {
        timerVolumeRef.current = Math.min(100, Math.max(0, settings.timerVolume));
        const timerAudio = audioRefs.current["timer-urgent"];
        if (timerAudio) {
          timerAudio.volume = timerVolumeRef.current / 100;
        }
      }

      if (settings.muted) {
        stopAllAudio();
      }
    };

    const playCue = (cue: AudioCue) => {
      if (cue === "intro-start") {
        playIntro();
        return;
      }

      if (cue === "intro-stop") {
        fadeOutIntro();
        return;
      }

      if (cue === "timer-stop") {
        stopTimer();
        return;
      }

      if (mutedRef.current) {
        stopTimer();
        return;
      }

      const src = soundMap[cue];
      if (!src) return;

      if (cue !== "timer-urgent") {
        stopTimer();
      }

      const audio = getAudio(cue, src);
      audio.currentTime = 0;
      audio.volume =
        cue === "timer-urgent"
          ? timerVolumeRef.current / 100
          : effectsVolumeRef.current / 100;
      audio.loop = cue === "timer-urgent";

      void audio.play().catch(() => {
        // Browsers may block playback until the first gesture. The game should stay silent, not broken.
      });
    };

    const handleAudioCue = (event: Event) => {
      const detail = (event as CustomEvent<{ cue?: AudioCue }>).detail;
      if (!detail?.cue) return;

      playCue(detail.cue);
    };

    const handleAudioSettings = (event: Event) => {
      const detail = (
        event as CustomEvent<{
          effectsVolume?: number;
          muted?: boolean;
          timerVolume?: number;
        }>
      ).detail;

      applySettings(detail ?? {});
    };

    window.addEventListener("stiucastii:audio-cue", handleAudioCue);
    window.addEventListener("stiucastii:audio-settings", handleAudioSettings);

    return () => {
      window.removeEventListener("stiucastii:audio-cue", handleAudioCue);
      window.removeEventListener("stiucastii:audio-settings", handleAudioSettings);
      stopTimer();
    };
  }, []);

  function isIntroPath(path: string | null) {
    return path === "/" || path === "/play/nickname" || path === "/play/heart";
  }

  function stopTimer() {
    const timerAudio = audioRefs.current["timer-urgent"];
    if (!timerAudio) return;

    timerAudio.pause();
    timerAudio.currentTime = 0;
  }

  function stopNonIntroAudio() {
    Object.entries(audioRefs.current).forEach(([cue, audio]) => {
      if (!audio || cue === "intro-start") return;

      audio.pause();
      audio.currentTime = 0;
    });
  }

  function stopAllAudio() {
    clearIntroFade();
    Object.values(audioRefs.current).forEach((audio) => {
      if (!audio) return;

      audio.pause();
      audio.currentTime = 0;
    });
  }

  function clearIntroFade() {
    if (introFadeRef.current === null) return;

    window.clearInterval(introFadeRef.current);
    introFadeRef.current = null;
  }

  function playIntro() {
    if (mutedRef.current) return;

    const src = soundMap["intro-start"];
    if (!src) return;

    clearIntroFade();
    const audio = getAudio("intro-start", src);
    audio.loop = true;
    audio.volume = 0.22;

    if (!audio.paused) return;

    void audio.play().catch(() => {
      // The first visit can be blocked until the user taps/clicks. The unlock listener retries it.
    });
  }

  function fadeOutIntro(durationMs = 1200) {
    const audio = audioRefs.current["intro-start"];
    if (!audio || audio.paused || mutedRef.current) return;

    clearIntroFade();
    const startVolume = audio.volume;
    const stepMs = 60;
    const volumeStep = startVolume / Math.max(1, durationMs / stepMs);

    introFadeRef.current = window.setInterval(() => {
      const nextVolume = Math.max(0, audio.volume - volumeStep);
      audio.volume = nextVolume;

      if (nextVolume > 0.001) return;

      clearIntroFade();
      audio.pause();
      audio.currentTime = 0;
      audio.volume = startVolume || 0.22;
    }, stepMs);
  }

  function getAudio(cue: AudioCue, src: string) {
    const existing = audioRefs.current[cue];
    if (existing) return existing;

    const audio = new Audio(src);
    audio.preload = "auto";
    audioRefs.current[cue] = audio;
    return audio;
  }

  function setAudioMuted(nextMuted: boolean) {
    mutedRef.current = nextMuted;
    setMuted(nextMuted);
    window.localStorage.setItem("stiucastii-audio-muted", String(nextMuted));
    window.dispatchEvent(
      new CustomEvent("stiucastii:audio-settings", {
        detail: { muted: nextMuted },
      }),
    );

    if (nextMuted) {
      stopAllAudio();
      return;
    }

    if (isIntroPath(pathname)) {
      window.setTimeout(playIntro, 0);
    }
  }

  function toggleMute() {
    setAudioMuted(!mutedRef.current);
  }

  function handleMutePointerDown(event: PointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    toggleMute();
  }

  function handleMuteKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    toggleMute();
  }

  return (
    <>
      {children}
      <button
        aria-label={muted ? "Pornește sunetul" : "Oprește sunetul"}
        aria-pressed={muted}
        className="audio-mute-button"
        onKeyDown={handleMuteKeyDown}
        onPointerDown={handleMutePointerDown}
        type="button"
      >
        {muted ? (
          <VolumeX aria-hidden="true" size={22} strokeWidth={3} />
        ) : (
          <Volume2 aria-hidden="true" size={22} strokeWidth={3} />
        )}
      </button>
    </>
  );
}
