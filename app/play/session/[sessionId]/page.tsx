import { notFound } from "next/navigation";
import { ServerGame } from "@/components/game/ServerGame";
import { GameShell } from "@/components/layout/GameShell";
import {
  getCategoryOptions,
  getGameResumeSnapshot,
  getSessionForPlay,
} from "@/lib/game-session";

type SessionPageProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function SessionPage({ params }: SessionPageProps) {
  const { sessionId } = await params;
  const session = await getSessionForPlay(sessionId);

  if (!session) {
    notFound();
  }

  const categories = await getCategoryOptions(6, session.id);
  const resumeSnapshot = await getGameResumeSnapshot(session.id);

  return (
    <GameShell>
      <ServerGame
        initialCategories={categories}
        initialState={resumeSnapshot}
        initialTemporaryHearts={session.temporaryHearts}
        playerHeartColor={session.heartColor}
        playerName={session.player.nickname}
        sessionId={session.id}
      />
    </GameShell>
  );
}
