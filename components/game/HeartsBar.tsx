"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { HeartColor } from "@/lib/demo-data";

type HeartsBarProps = {
  count?: number;
  color?: HeartColor;
  lostSignal?: number;
  urgentLastHeart?: boolean;
};

const burstParticles = [
  ["0px", "-26px"],
  ["20px", "-20px"],
  ["28px", "0px"],
  ["20px", "20px"],
  ["0px", "26px"],
  ["-20px", "20px"],
  ["-28px", "0px"],
  ["-20px", "-20px"],
];

const burstColors = {
  orange: "#F26B25",
  blue: "#0A87DD",
};

export function HeartsBar({
  count = 3,
  color = "orange",
  lostSignal = 0,
  urgentLastHeart = false,
}: HeartsBarProps) {
  const previousCount = useRef(count);
  const previousLostSignal = useRef(lostSignal);
  const [lostHeart, setLostHeart] = useState<{
    id: number;
    index: number;
  } | null>(null);
  const addedFromIndex =
    count > previousCount.current ? previousCount.current : Number.POSITIVE_INFINITY;

  useEffect(() => {
    previousCount.current = count;
  }, [count]);

  useEffect(() => {
    if (lostSignal <= previousLostSignal.current) return;

    previousLostSignal.current = lostSignal;
    const id = lostSignal;
    setLostHeart({ id, index: count });

    const timer = window.setTimeout(() => {
      setLostHeart((current) => (current?.id === id ? null : current));
    }, 780);

    return () => window.clearTimeout(timer);
  }, [count, lostSignal]);

  return (
    <div className="flex max-w-[300px] flex-wrap items-center gap-x-[4px] gap-y-[4px]">
      {Array.from({ length: count }).map((_, index) => {
        const isNewHeart = index >= addedFromIndex;
        const isCriticalHeart = urgentLastHeart && count === 1 && index === 0;

        return (
          <span
            className={`${isNewHeart ? "heart-earned-pop" : "heart-earned-slot"} ${
              isCriticalHeart ? "heart-critical-slot" : ""
            }`}
            key={`${color}-${index}`}
            style={
              {
                "--heart-pop-index": index - addedFromIndex,
                "--heart-burst-color": burstColors[color],
              } as CSSProperties
            }
          >
            <span
              aria-hidden="true"
              className={`status-heart status-heart-${color}`}
            />
            {isNewHeart
              ? burstParticles.map(([x, y]) => (
                  <span
                    aria-hidden="true"
                    className="heart-earned-particle"
                    key={`${x}-${y}`}
                    style={{ "--tx": x, "--ty": y } as CSSProperties}
                  />
                ))
              : null}
          </span>
        );
      })}
      {lostHeart ? (
        <span
          className="heart-lost-pop"
          key={`${color}-lost-${lostHeart.id}`}
          style={
            {
              "--heart-burst-color": burstColors[color],
            } as CSSProperties
          }
        >
          <span
            aria-hidden="true"
            className={`status-heart status-heart-${color}`}
          />
          {burstParticles.map(([x, y]) => (
            <span
              aria-hidden="true"
              className="heart-lost-particle"
              key={`${x}-${y}`}
              style={{ "--tx": x, "--ty": y } as CSSProperties}
            />
          ))}
        </span>
      ) : null}
    </div>
  );
}
