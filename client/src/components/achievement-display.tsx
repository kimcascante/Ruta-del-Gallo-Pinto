import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Trophy, Star, Award, Crown, Zap } from "lucide-react"
import useAppStore from "../zustand/store"

export function AchievementDisplay() {
  const player = useAppStore(state => state.player);

  // Achievement definitions based on the README
  const achievements = [
    {
      id: 1,
      name: "MiniGamer",
      description: "Complete 1 action",
      icon: Star,
      requirement: 1,
      color: "from-yellow-400 to-yellow-600",
      unlocked: player ? (player.experience + player.coins + Math.floor(player.health / 20)) >= 1 : false
    },
    {
      id: 2,
      name: "MasterGamer",
      description: "Complete 10 actions",
      icon: Trophy,
      requirement: 10,
      color: "from-orange-400 to-orange-600",
      unlocked: player ? (player.experience + player.coins + Math.floor(player.health / 20)) >= 10 : false
    },
    {
      id: 3,
      name: "LegendGamer",
      description: "Complete 20 actions",
      icon: Award,
      requirement: 20,
      color: "from-red-400 to-red-600",
      unlocked: player ? (player.experience + player.coins + Math.floor(player.health / 20)) >= 20 : false
    },
    {
      id: 4,
      name: "AllStarGamer",
      description: "Complete 30 actions",
      icon: Zap,
      requirement: 30,
      color: "from-purple-400 to-purple-600",
      unlocked: player ? (player.experience + player.coins + Math.floor(player.health / 20)) >= 30 : false
    },
    {
      id: 5,
      name: "SenseiGamer",
      description: "Complete 50 actions",
      icon: Crown,
      requirement: 50,
      color: "from-indigo-400 to-indigo-600",
      unlocked: player ? (player.experience + player.coins + Math.floor(player.health / 20)) >= 50 : false
    }
  ];

  // Calculate total actions (rough estimate based on player stats)
  const totalActions = player ? 
    Math.floor(player.experience / 10) + Math.floor(player.coins / 5) + Math.floor(player.health / 20) : 0;

  // Calculate unlocked achievements
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Achievements
          <span className="text-sm text-slate-400 ml-auto">
            {unlockedCount}/{achievements.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!player ? (
          <div className="text-center py-8">
            <div className="text-slate-400 mb-2">🎮 Connect controller to see achievements</div>
            <div className="text-sm text-slate-500">Complete actions to unlock achievements</div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Progress overview */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300 text-sm">Total Actions</span>
                <span className="text-white font-bold">{totalActions}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totalActions / 50) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Achievement grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`relative p-4 rounded-lg border transition-all duration-300 ${
                      achievement.unlocked
                        ? `bg-gradient-to-br ${achievement.color} border-white/20 shadow-lg`
                        : 'bg-white/5 border-white/10 opacity-50'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className={`p-2 rounded-full ${
                        achievement.unlocked 
                          ? 'bg-white/20' 
                          : 'bg-slate-600/50'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          achievement.unlocked ? 'text-white' : 'text-slate-400'
                        }`} />
                      </div>
                      <div>
                        <div className={`font-bold text-sm ${
                          achievement.unlocked ? 'text-white' : 'text-slate-400'
                        }`}>
                          {achievement.name}
                        </div>
                        <div className="text-xs text-slate-300 mt-1">
                          {achievement.description}
                        </div>
                      </div>
                      {achievement.unlocked && (
                        <div className="absolute -top-1 -right-1">
                          <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 