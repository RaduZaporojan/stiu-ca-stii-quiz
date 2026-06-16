import Link from "next/link";
import { cn } from "@/lib/utils";

type CategoryDrawerProps = {
  name: string;
  href?: string;
  asButton?: boolean;
};

function DrawerContent({ name }: { name: string }) {
  return (
    <>
      <span className="mb-2 block text-[18px] font-bold uppercase leading-tight text-[#00518f] sm:text-[20px]">
        {name}
      </span>
      <span
        className={cn(
          "game-gradient flex h-[54px] w-full items-center justify-center rounded-[16px] shadow-game transition sm:h-[57px]",
          "group-hover:-translate-y-1 group-hover:shadow-soft",
        )}
      >
        <span className="h-[10px] w-[104px] rounded-full bg-white" />
      </span>
    </>
  );
}

export function CategoryDrawer({
  name,
  href = "/play/session/demo",
  asButton = false,
}: CategoryDrawerProps) {
  if (asButton) {
    return (
      <span className="group block text-center">
        <DrawerContent name={name} />
      </span>
    );
  }

  return (
    <Link className="group block text-center" href={href}>
      <DrawerContent name={name} />
    </Link>
  );
}
