import Link from "next/link";
import type { ReactNode } from "react";
import { getLeaderboard } from "@/lib/leaderboard";
import { AppButton } from "./AppButton";
import { BrandLogo } from "./BrandLogo";
import { ConfirmExitLink } from "./ConfirmExitLink";
import { Footer } from "./Footer";
import { LeaderboardSidebar } from "./LeaderboardSidebar";
import { LeftSidebar } from "./LeftSidebar";

type GameShellProps = {
  children: ReactNode;
  confirmExit?: boolean;
};

export async function GameShell({
  children,
  confirmExit = true,
}: GameShellProps) {
  const leaderboard = await getLeaderboard(5);
  const entries = leaderboard.map((entry) => ({
    nickname: entry.player.nickname,
    heartColor: entry.player.heartColor,
    totalPermanentHearts: entry.totalPermanentHearts,
  }));

  const mobileLogo = <BrandLogo size="sidebar" />;

  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden bg-white">
      <div className="grid flex-1 lg:grid-cols-[26.6%_50.9%_22.5%]">
        <div className="hidden lg:block">
          <LeftSidebar confirmExit={confirmExit} />
        </div>
        <section className="min-h-[calc(100svh-96px)] px-4 py-5 sm:px-8 lg:min-h-[664px] lg:px-5 lg:py-12">
          <div className="mb-5 flex items-start justify-between gap-3 lg:hidden">
            {confirmExit ? (
              <ConfirmExitLink
                className="rounded-[18px] border-0 bg-transparent p-0 transition hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-stiucastiiBlue/20 active:scale-[0.99]"
                href="/"
                label="Înapoi la prima pagină"
              >
                {mobileLogo}
              </ConfirmExitLink>
            ) : (
              <Link
                aria-label="Înapoi la prima pagină"
                className="rounded-[18px] transition hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-stiucastiiBlue/20 active:scale-[0.99]"
                href="/"
              >
                {mobileLogo}
              </Link>
            )}
            <div className="flex min-w-[142px] flex-col gap-2 pt-2">
              <AppButton
                className="min-h-[44px] max-w-[150px] rounded-[12px] text-[17px]"
                href="/play/nickname"
              >
                Joc nou
              </AppButton>
              <AppButton
                className="min-h-[44px] max-w-[150px] rounded-[12px] text-[17px]"
                href="/settings"
              >
                Setări
              </AppButton>
            </div>
          </div>
          <div className="mx-auto flex h-full max-w-[720px] flex-col items-center">
            {children}
          </div>
        </section>
        <div className="hidden lg:block">
          <LeaderboardSidebar entries={entries} />
        </div>

        <div className="px-4 pb-7 pt-2 lg:hidden">
          <div className="mx-auto max-w-[640px] rounded-[16px] border border-stiucastiiBlue/20 p-4">
            <LeaderboardSidebar compact entries={entries} />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
