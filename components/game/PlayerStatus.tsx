import type { HeartColor } from "@/lib/demo-data";
import { HeartsBar } from "./HeartsBar";

type PlayerStatusProps = {
  name?: string;
  hearts?: number;
  color?: HeartColor;
  lostHeartSignal?: number;
  urgentLastHeart?: boolean;
};

export function PlayerStatus({
  name = "PlayerName",
  hearts = 3,
  color = "orange",
  lostHeartSignal = 0,
  urgentLastHeart = false,
}: PlayerStatusProps) {
  const showLastHeartWarning = urgentLastHeart && hearts === 1;

  return (
    <div className="max-w-full self-start">
      <p className="truncate text-[23px] font-extrabold leading-none sm:text-[25px]">{name}</p>
      <div className="mt-1">
        <HeartsBar
          color={color}
          count={hearts}
          lostSignal={lostHeartSignal}
          urgentLastHeart={urgentLastHeart}
        />
      </div>
      {showLastHeartWarning ? (
        <p className="final-last-heart-label mt-1 text-[12px] font-extrabold uppercase leading-none text-stiucastiiOrange">
          Ultima inimă
        </p>
      ) : null}
    </div>
  );
}
