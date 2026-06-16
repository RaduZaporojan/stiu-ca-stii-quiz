import Link from "next/link";
import { AppButton } from "./AppButton";
import { BrandLogo } from "./BrandLogo";
import { ConfirmExitLink } from "./ConfirmExitLink";

type LeftSidebarProps = {
  confirmExit?: boolean;
};

export function LeftSidebar({ confirmExit = true }: LeftSidebarProps) {
  const logo = <BrandLogo size="sidebar" />;

  return (
    <aside className="flex h-full items-start justify-center border-r border-stiucastiiBlue/70 px-6 py-8 lg:w-full">
      <div className="flex w-full max-w-[300px] flex-col items-center gap-16 pt-4">
        {confirmExit ? (
          <ConfirmExitLink
            className="rounded-[22px] border-0 bg-transparent p-0 transition hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-stiucastiiBlue/20 active:scale-[0.99]"
            href="/"
            label="Înapoi la prima pagină"
          >
            {logo}
          </ConfirmExitLink>
        ) : (
          <Link
            aria-label="Înapoi la prima pagină"
            className="rounded-[22px] transition hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-stiucastiiBlue/20 active:scale-[0.99]"
            href="/"
          >
            {logo}
          </Link>
        )}

        <div className="flex w-full flex-col items-center gap-3">
          <AppButton className="w-full min-w-0" href="/play/nickname">
            Începe jocul
          </AppButton>
          <AppButton className="w-full min-w-0" href="/settings">
            Setări
          </AppButton>
        </div>
      </div>
    </aside>
  );
}
