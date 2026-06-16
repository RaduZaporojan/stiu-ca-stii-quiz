import { PlayableGame } from "@/components/game/PlayableGame";
import { GameShell } from "@/components/layout/GameShell";

export const dynamic = "force-dynamic";

export default function CategoriesPage() {
  return (
    <GameShell>
      <PlayableGame />
    </GameShell>
  );
}
