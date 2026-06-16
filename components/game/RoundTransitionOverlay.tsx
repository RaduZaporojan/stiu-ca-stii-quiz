"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type RoundTransitionPhase = "idle" | "covering" | "showing" | "revealing";

type RoundTransitionOverlayProps = {
  phase: RoundTransitionPhase;
  heartCount: number;
  emptyMessage?: string;
};

const particles = [
  ["0px", "-100px"],
  ["70px", "-70px"],
  ["100px", "0px"],
  ["70px", "70px"],
  ["0px", "100px"],
  ["-70px", "70px"],
  ["-100px", "0px"],
  ["-70px", "-70px"],
];

export function RoundTransitionOverlay({
  phase,
  heartCount,
  emptyMessage = "Succes!",
}: RoundTransitionOverlayProps) {
  const active = phase !== "idle";
  const visibleHearts = Math.max(0, Math.min(heartCount, 15));

  return (
    <div
      aria-hidden="true"
      className={cn(
        "circle-transition",
        active && "is-active",
        phase === "covering" && "is-covering",
        phase === "showing" && "is-covering is-showing-like",
        phase === "revealing" && "is-revealing is-showing-like",
      )}
    >
      <div className="circle circle-1" />
      <div className="circle circle-2" />
      <div className="circle circle-3">
        <div className="like-container">
          <div className="transition-score">
            {visibleHearts > 0 ? (
              <div className="transition-heart-grid">
                {Array.from({ length: visibleHearts }).map((_, index) => (
                  <span
                    className="transition-heart"
                    key={index}
                    style={{ "--heart-index": index } as CSSProperties}
                  />
                ))}
              </div>
            ) : (
              <p className="transition-success">{emptyMessage}</p>
            )}
          </div>
          {particles.map(([x, y]) => (
            <span
              className="particle"
              key={`${x}-${y}`}
              style={{ "--tx": x, "--ty": y } as CSSProperties}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
