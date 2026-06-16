"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type AnswerButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  state?: "idle" | "pending" | "correct" | "wrong";
};

type ClickPoint = {
  x: number;
  y: number;
};

const particleCount = 8;

export function AnswerButton({
  children,
  disabled = false,
  onClick,
  state = "idle",
}: AnswerButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastClickPointRef = useRef<ClickPoint>({ x: 50, y: 50 });
  const [effectRunId, setEffectRunId] = useState(0);
  const isPending = state === "pending";
  const isCorrect = state === "correct";
  const isWrong = state === "wrong";
  const effectType = isCorrect ? "success" : isWrong ? "error" : null;

  useEffect(() => {
    if (!effectType) return;

    setEffectRunId((value) => value + 1);
  }, [effectType]);

  function rememberPointer(event: React.PointerEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    lastClickPointRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function rememberKeyboardPoint() {
    const rect = buttonRef.current?.getBoundingClientRect();
    lastClickPointRef.current = {
      x: rect ? rect.width / 2 : 50,
      y: rect ? rect.height / 2 : 50,
    };
  }

  return (
    <button
      className={cn(
        "game-gradient answer-choice relative min-h-[58px] overflow-visible rounded-[14px] border border-white/0 px-4 py-3 text-center text-[18px] font-bold leading-tight text-white shadow-game transition sm:min-h-[63px] sm:px-5 sm:text-[20px]",
        !disabled && "hover:-translate-y-0.5 hover:shadow-soft active:translate-y-0",
        disabled && "cursor-default",
        isPending && "answer-pending scale-[1.025]",
        isCorrect && "answer-feedback-success",
        isWrong && "answer-feedback-error",
      )}
      disabled={disabled}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          rememberKeyboardPoint();
        }
      }}
      onPointerDown={rememberPointer}
      ref={buttonRef}
    >
      <span className="relative z-20 pointer-events-none">{children}</span>
      {effectType ? (
        <AnswerConfirmationEffect
          clickPoint={lastClickPointRef.current}
          key={`${effectType}-${effectRunId}`}
          type={effectType}
        />
      ) : null}
    </button>
  );
}

function AnswerConfirmationEffect({
  clickPoint,
  type,
}: {
  clickPoint: ClickPoint;
  type: "success" | "error";
}) {
  const color = type === "success" ? "#22C55E" : "#EF4444";
  const softColor = type === "success" ? "rgba(74, 222, 128, 0.9)" : "rgba(248, 113, 113, 0.9)";

  return (
    <>
      <span
        aria-hidden="true"
        className="answer-confirmation-ring"
        style={{ "--answer-confirmation-color": color } as React.CSSProperties}
      />
      {Array.from({ length: particleCount }).map((_, index) => {
        const angle = (index / particleCount) * Math.PI * 2;
        const distance = 36 + ((index * 17) % 38);
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        return (
          <span
            aria-hidden="true"
            className="answer-confirmation-particle"
            key={index}
            style={
              {
                "--particle-color": softColor,
                "--particle-delay": `${(index % 4) * 18}ms`,
                "--particle-left": `${clickPoint.x}px`,
                "--particle-top": `${clickPoint.y}px`,
                "--particle-tx": `${tx}px`,
                "--particle-ty": `${ty}px`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </>
  );
}
