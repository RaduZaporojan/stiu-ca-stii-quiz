"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

type PopUpSequenceId = "ioana-app1" | "ioana-app2" | "ioana-app4";

type CorrectAnswerPopUpProps = {
  id: number;
  left: number;
  top: number;
  rotation: number;
  sequence: PopUpSequenceId;
  size?: number;
  onDone: (id: number) => void;
};

const sequenceConfig: Record<
  PopUpSequenceId,
  { count: number; folder: string; prefix: string; frameMs: number }
> = {
  "ioana-app1": {
    count: 104,
    folder: "ioana-app1",
    prefix: "Ioana_app",
    frameMs: 82,
  },
  "ioana-app2": {
    count: 86,
    folder: "ioana-app2",
    prefix: "Ioana app2",
    frameMs: 88,
  },
  "ioana-app4": {
    count: 28,
    folder: "ioana-app4",
    prefix: "Ioana app4",
    frameMs: 96,
  },
};

const burstColors = ["#FFFFFF", "#F26B25", "#0A87DD", "#FFE7D8"];

function framePath(sequence: PopUpSequenceId, frame: number) {
  const config = sequenceConfig[sequence];
  const fileName = `${config.prefix}_${String(frame).padStart(5, "0")}.png`;

  return `/assets/pop-up-animations/${config.folder}/${encodeURIComponent(fileName)}`;
}

export function CorrectAnswerPopUp({
  id,
  left,
  top,
  rotation,
  sequence,
  size = 132,
  onDone,
}: CorrectAnswerPopUpProps) {
  const [frame, setFrame] = useState(0);
  const config = sequenceConfig[sequence];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFrame((value) => (value + 1) % config.count);
    }, config.frameMs);

    const timeout = window.setTimeout(() => {
      onDone(id);
    }, 1900);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [config.count, config.frameMs, id, onDone]);

  const src = useMemo(() => framePath(sequence, frame), [frame, sequence]);
  const particles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 10 + id * 0.37;
        const distance = 46 + ((id + index * 13) % 34);

        return {
          color: burstColors[(id + index) % burstColors.length],
          delay: 0.05 + index * 0.018,
          size: 7 + ((id + index) % 6),
          tx: Math.cos(angle) * distance,
          ty: Math.sin(angle) * distance,
        };
      }),
    [id],
  );

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute z-40 max-w-[48vw] select-none sm:max-w-none"
      initial={{ opacity: 0, scale: 0.48, x: "-50%", y: "calc(-50% + 14px)", rotate: rotation - 5 }}
      animate={{
        opacity: [0, 1, 1, 1],
        scale: [0.48, 1.22, 1.08, 1.06],
        x: "-50%",
        y: ["calc(-50% + 14px)", "calc(-50% - 8px)", "calc(-50% - 14px)", "calc(-50% - 26px)"],
        rotate: [rotation - 5, rotation + 2, rotation, rotation + 4],
      }}
      transition={{
        duration: 1.9,
        ease: [0.22, 1, 0.36, 1],
        times: [0, 0.16, 0.78, 1],
      }}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: size,
      }}
    >
      <div className="correct-popup-instant" />
      {Array.from({ length: 7 }, (_, index) => (
        <span
          className="correct-popup-ray"
          key={`${id}-ray-${index}`}
          style={{
            "--ray-index": index,
          } as CSSProperties}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 z-0">
        {particles.map((particle, index) => (
          <motion.span
            className="absolute left-1/2 top-1/2 rounded-full"
            initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0.2],
              x: `calc(-50% + ${particle.tx}px)`,
              y: `calc(-50% + ${particle.ty}px)`,
            }}
            key={`${id}-burst-${index}`}
            style={{
              backgroundColor: particle.color,
              boxShadow: `0 0 12px ${particle.color}`,
              height: particle.size,
              width: particle.size,
            }}
            transition={{ delay: particle.delay, duration: 0.72, ease: "easeOut" }}
          />
        ))}
      </div>
      <img
        alt=""
        className="relative z-10 h-auto w-full object-contain mix-blend-screen brightness-110 contrast-125 saturate-125 drop-shadow-[0_12px_18px_rgba(0,0,0,0.18)]"
        draggable={false}
        src={src}
      />
    </motion.div>
  );
}
