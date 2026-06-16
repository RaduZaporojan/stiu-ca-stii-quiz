import type { HeartColor } from "@prisma/client";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type LeaderboardDisplayEntry = {
  nickname: string;
  heartColor: HeartColor;
  totalPermanentHearts: number;
};

type LeaderboardListProps = {
  entries: LeaderboardDisplayEntry[];
  compact?: boolean;
};

export function LeaderboardList({ entries, compact = false }: LeaderboardListProps) {
  if (entries.length === 0) {
    return (
      <p className="text-[16px] font-bold leading-snug text-stiucastiiDark/65">
        Clasamentul se va completa după primele jocuri câștigate.
      </p>
    );
  }

  return (
    <div className={cn(compact ? "space-y-[16px] sm:space-y-[22px]" : "w-full space-y-4")}>
      {entries.map((entry) => (
        <div
          className={cn(
            "items-center",
            compact
              ? "grid grid-cols-[92px_1fr] gap-2 sm:grid-cols-[104px_1fr]"
              : "flex gap-5 rounded-[18px] border-2 border-stiucastiiBlue/15 bg-white px-5 py-4 text-left shadow-soft",
          )}
          key={entry.nickname}
        >
          <div className="flex items-center whitespace-nowrap">
            <Image
              alt=""
              height={compact ? 28 : 34}
              src={`/assets/heart-${entry.heartColor}-small.png`}
              width={compact ? 50 : 60}
            />
            <span
              className={cn(
                "-ml-1 font-extrabold leading-none",
                compact ? "text-[22px] sm:text-[25px]" : "text-[30px]",
              )}
            >
              x{entry.totalPermanentHearts}
            </span>
          </div>
          <span
            className={cn(
              "min-w-0 font-extrabold leading-tight",
              compact ? "truncate text-[14px]" : "text-[22px]",
            )}
          >
            {entry.nickname}
          </span>
        </div>
      ))}
    </div>
  );
}
