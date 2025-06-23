import { PlayerStats } from "./player-stats"
import { GameActions } from "./game-actions"

export function GameSection() {
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-8">
      <PlayerStats />
      <GameActions />
    </div>
  )
}
