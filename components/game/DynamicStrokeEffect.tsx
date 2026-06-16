"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type DynamicStrokeEffectProps = {
  active: boolean;
  color?: string;
  duration?: number;
  intensity?: "low" | "medium" | "high";
};

const strokePaths = [
  "M8 30 C18 8, 42 8, 54 18",
  "M48 8 C75 5, 96 18, 94 39",
  "M92 46 C104 63, 91 90, 65 92",
  "M58 95 C32 101, 8 84, 12 61",
  "M7 54 C0 35, 15 18, 34 15",
  "M72 13 C91 24, 100 48, 88 67",
];

const intensityConfig = {
  low: { count: 4, spread: 4, width: 4 },
  medium: { count: 5, spread: 7, width: 5 },
  high: { count: 6, spread: 10, width: 6 },
};

export function DynamicStrokeEffect({
  active,
  color = "#22C55E",
  duration = 0.9,
  intensity = "medium",
}: DynamicStrokeEffectProps) {
  const [visible, setVisible] = useState(false);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (!active) return;

    setVisible(true);
    setRunId((value) => value + 1);

    const timeout = window.setTimeout(() => {
      setVisible(false);
    }, duration * 1000 + 260);

    return () => window.clearTimeout(timeout);
  }, [active, duration]);

  const strokes = useMemo(() => {
    const config = intensityConfig[intensity];

    return strokePaths.slice(0, config.count).map((path, index) => ({
      path,
      delay: index * 0.045 + Math.random() * 0.055,
      rotate: (Math.random() - 0.5) * 12,
      x: (Math.random() - 0.5) * config.spread,
      y: (Math.random() - 0.5) * config.spread,
      width: config.width + Math.random() * 1.5,
    }));
  }, [intensity, runId]);

  if (!visible) return null;

  return (
    <motion.svg
      aria-hidden="true"
      className="pointer-events-none absolute -inset-[14px] z-10 h-[calc(100%+28px)] w-[calc(100%+28px)] overflow-visible"
      fill="none"
      initial={{ opacity: 0.8, scale: 0.98 }}
      animate={{ opacity: 0, scale: 1.09 }}
      transition={{ delay: duration * 0.5, duration: duration * 0.5, ease: "easeOut" }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {strokes.map((stroke, index) => (
        <motion.path
          d={stroke.path}
          key={`${runId}-${index}`}
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={stroke.width}
          strokeDasharray="120"
          initial={{
            opacity: 0,
            rotate: stroke.rotate,
            scale: 0.98,
            strokeDashoffset: 120,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.98, 1.03, 1.08],
            strokeDashoffset: [120, 0, -36],
            x: stroke.x,
            y: stroke.y,
          }}
          transition={{
            delay: stroke.delay,
            duration,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.25, 0.72, 1],
          }}
          style={{ filter: `drop-shadow(0 0 7px ${color}66)`, transformOrigin: "center" }}
        />
      ))}
    </motion.svg>
  );
}
