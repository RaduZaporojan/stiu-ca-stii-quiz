import Image from "next/image";
import { cn } from "@/lib/utils";
import type { HeartColor } from "@/lib/demo-data";

type HeartProps = {
  color?: HeartColor;
  size?: "small" | "medium" | "large" | "hero";
  className?: string;
};

const sizeMap = {
  small: { width: 50, height: 28, className: "w-[34px] sm:w-[50px]" },
  medium: { width: 90, height: 51, className: "w-[62px] sm:w-[90px]" },
  large: { width: 360, height: 202, className: "w-[220px] sm:w-[300px] lg:w-[360px]" },
  hero: { width: 601, height: 338, className: "w-[240px] sm:w-[360px] lg:w-[420px]" },
};

export function Heart({ color = "orange", size = "small", className }: HeartProps) {
  const config = sizeMap[size];

  return (
    <Image
      alt={color === "orange" ? "Inimă oranj" : "Inimă albastră"}
      className={cn("h-auto object-contain", config.className, className)}
      height={config.height}
      src={`/assets/heart-${color}${size === "small" ? "-small" : ""}.png`}
      style={{ height: "auto" }}
      width={config.width}
    />
  );
}
