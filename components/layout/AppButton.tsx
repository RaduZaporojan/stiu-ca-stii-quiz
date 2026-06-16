import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AppButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "gradient";
  className?: string;
};

export function AppButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
}: AppButtonProps) {
  const classes = cn(
    "inline-flex h-[52px] min-h-[52px] w-full min-w-0 max-w-[285px] items-center justify-center rounded-[14px] px-5 text-center text-[22px] font-extrabold uppercase leading-none shadow-game transition hover:-translate-y-0.5 hover:shadow-soft active:translate-y-0 sm:h-14 sm:min-w-[285px] sm:text-[28px]",
    variant === "primary" && "bg-stiucastiiBlue text-white",
    variant === "secondary" &&
      "border-[3px] border-stiucastiiBlue bg-white text-stiucastiiBlue",
    variant === "gradient" && "game-gradient text-white",
    className,
  );

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
