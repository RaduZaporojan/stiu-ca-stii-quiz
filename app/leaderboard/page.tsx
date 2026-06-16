import { LeaderboardList } from "@/components/leaderboard/LeaderboardList";
import { AppButton } from "@/components/layout/AppButton";
import { Footer } from "@/components/layout/Footer";
import { getLeaderboard } from "@/lib/leaderboard";

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard(10);
  const entries = leaderboard.map((entry) => ({
    nickname: entry.player.nickname,
    heartColor: entry.player.heartColor,
    totalPermanentHearts: entry.totalPermanentHearts,
  }));

  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden bg-white">
      <section className="mx-auto flex w-full max-w-[760px] flex-1 flex-col items-center px-4 py-8 text-center sm:px-5 sm:py-12">
        <h1 className="text-[34px] font-extrabold leading-tight text-stiucastiiBlue sm:text-[42px]">
          Clasamentul inimilor
        </h1>
        <div className="mt-7 w-full sm:mt-10">
          <LeaderboardList entries={entries} />
        </div>
        <AppButton className="mt-10" href="/">
          Înapoi
        </AppButton>
      </section>
      <Footer />
    </main>
  );
}
