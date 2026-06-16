import { PlayableGame } from "@/components/game/PlayableGame";
import { GameShell } from "@/components/layout/GameShell";
import { findPlayerByNickname } from "@/lib/players";

export const dynamic = "force-dynamic";

type DemoGamePageProps = {
  searchParams: Promise<{ player?: string }>;
};

export default async function DemoGamePage({ searchParams }: DemoGamePageProps) {
  const { player: playerParam } = await searchParams;
  const player = playerParam ? await findPlayerByNickname(playerParam) : null;

  return (
    <GameShell>
      <PlayableGame
        playerHeartColor={player?.heartColor ?? "orange"}
        playerName={player?.nickname ?? playerParam ?? "PlayerName"}
      />
    </GameShell>
  );
}
