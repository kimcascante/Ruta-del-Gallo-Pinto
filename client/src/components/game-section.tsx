import { PlayerStats } from "./player-stats"
import { GameActions } from "./game-actions"
import { AchievementDisplay } from "./achievement-display"

export function GameSection() {
  return (
    <div className="space-y-8 mb-8">
      {/* Main game area */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GameActions />
        </div>
        <div>
          <PlayerStats />
        </div>
      </div>
      
      {/* Achievement section */}
      <AchievementDisplay />
    </div>
  )
}
