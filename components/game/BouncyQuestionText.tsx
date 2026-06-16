import { useEffect, type CSSProperties } from "react";

type BouncyQuestionTextProps = {
  text: string;
  className?: string;
  active?: boolean;
  onRevealComplete?: () => void;
};

export function BouncyQuestionText({
  text,
  className,
  active = true,
  onRevealComplete,
}: BouncyQuestionTextProps) {
  const segments = text.split(/(\s+)/);
  const animatedSegments = segments.filter((segment) => segment.trim() !== "");
  let animationIndex = 0;

  useEffect(() => {
    if (!active) return;

    const revealDurationMs = 780 + Math.max(0, animatedSegments.length - 1) * 55 + 120;
    const timer = window.setTimeout(() => {
      onRevealComplete?.();
    }, revealDurationMs);

    return () => window.clearTimeout(timer);
  }, [active, animatedSegments.length, onRevealComplete, text]);

  return (
    <h1
      aria-label={text}
      className={`question-bounce-text ${active ? "is-active" : ""} ${className ?? ""}`}
    >
      {segments.map((segment, index) => {
        if (segment.trim() === "") {
          return segment;
        }

        const delay = animationIndex * 0.055;
        animationIndex += 1;

        return (
          <span
            aria-hidden="true"
            className="question-bounce-word"
            key={`${segment}-${index}`}
            style={{ "--question-word-delay": `${delay}s` } as CSSProperties}
          >
            {segment}
          </span>
        );
      })}
    </h1>
  );
}
