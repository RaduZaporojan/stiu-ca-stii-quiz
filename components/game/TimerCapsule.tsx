import { cn } from "@/lib/utils";

export function TimerCapsule({
  value = "00:30",
  urgent = false,
}: {
  value?: string;
  urgent?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative h-[57px] w-[138px] bg-[url('/assets/timer-background.png')] bg-[length:100%_100%] bg-center bg-no-repeat text-[34px] font-extrabold leading-none text-white drop-shadow-[0_13px_18px_rgba(0,0,0,0.14)] sm:h-[70px] sm:w-[169px] sm:text-[42px]",
        urgent && "timer-urgent-shake",
      )}
    >
      <span className="absolute left-1/2 top-[23px] -translate-x-1/2 -translate-y-1/2 tabular-nums sm:top-[29px]">
        {value}
      </span>
    </div>
  );
}
