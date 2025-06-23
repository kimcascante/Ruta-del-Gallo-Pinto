import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { useAccount } from "@starknet-react/core"
import useAppStore from "../zustand/store"
import { Coins, Zap, Heart, Loader2, AlertTriangle, User, TrendingUp, Shield } from "lucide-react"

export function PlayerStats() {
  const { status } = useAccount();
  const player = useAppStore(state => state.player);
  const isLoading = useAppStore(state => state.isLoading);

  const isConnected = status === "connected";

  // Use real player data or default values
  const stats = [
    {
      label: "Experience",
      value: player?.experience || 0,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30",
      icon: Zap
    },
    {
      label: "Health",
      value: player?.health || 100,
      color: getHealthColor(player?.health || 100),
      bgColor: getHealthBgColor(player?.health || 100),
      borderColor: getHealthBorderColor(player?.health || 100),
      icon: Heart,
      max: 100
    },
    {
      label: "Coins",
      value: player?.coins || 0,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      borderColor: "border-yellow-500/30",
      icon: Coins
    },
  ];

  // Function to get health color based on value
  function getHealthColor(health: number): string {
    if (health >= 80) return "text-green-400";
    if (health >= 50) return "text-yellow-400";
    if (health >= 20) return "text-orange-400";
    return "text-red-400";
  }

  function getHealthBgColor(health: number): string {
    if (health >= 80) return "bg-green-500/20";
    if (health >= 50) return "bg-yellow-500/20";
    if (health >= 20) return "bg-orange-500/20";
    return "bg-red-500/20";
  }

  function getHealthBorderColor(health: number): string {
    if (health >= 80) return "border-green-500/30";
    if (health >= 50) return "border-yellow-500/30";
    if (health >= 20) return "border-orange-500/30";
    return "border-red-500/30";
  }

  // Calculate experience for level up (example: every 100 exp = 1 level)
  const currentLevel = Math.floor((player?.experience || 0) / 100) + 1;
  const expInCurrentLevel = (player?.experience || 0) % 100;
  const expNeededForNextLevel = 100;

  if (isLoading) {
    return (
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
            <User className="w-6 h-6 text-blue-400" />
            Player Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-slate-300">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading player data...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
          <User className="w-6 h-6 text-blue-400" />
          Player Stats
          {player && (
            <span className="text-sm text-slate-400 ml-auto">
              Level {currentLevel}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main stats with enhanced design */}
        <div className="space-y-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label} 
                className={`p-4 rounded-lg border transition-all duration-300 hover:scale-105 ${stat.bgColor} ${stat.borderColor}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/10">
                      <Icon className="w-5 h-5 text-slate-300" />
                    </div>
                    <div>
                      <div className="text-slate-300 text-sm font-medium">{stat.label}</div>
                      <div className={`font-bold text-xl ${stat.color}`}>
                        {stat.value}
                        {stat.max && `/${stat.max}`}
                      </div>
                    </div>
                  </div>
                  {/* Low health indicator */}
                  {stat.label === "Health" && stat.value <= 20 && (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 text-xs">Critical</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Experience bar with enhanced design */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300 font-medium">Experience</span>
            </div>
            <div className="text-right">
              <div className="text-blue-400 font-bold text-lg">Level {currentLevel}</div>
              <div className="text-slate-400 text-sm">
                {expInCurrentLevel} / {expNeededForNextLevel} EXP
              </div>
            </div>
          </div>
          <div className="relative">
            <Progress
              value={(expInCurrentLevel / expNeededForNextLevel) * 100}
              className="h-3 bg-slate-700 rounded-full overflow-hidden"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full"></div>
          </div>
        </div>

        {/* Health bar with enhanced design */}
        {player && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-slate-300 font-medium">Health Status</span>
              </div>
              <div className="text-right">
                <div className={`font-bold text-lg ${getHealthColor(player.health)}`}>
                  {player.health}%
                </div>
                <div className={`text-sm ${getHealthColor(player.health)}`}>
                  {player.health >= 80 ? "Excellent" :
                    player.health >= 50 ? "Good" :
                      player.health >= 20 ? "Poor" : "Critical"}
                </div>
              </div>
            </div>
            <div className="relative">
              <Progress
                value={player.health}
                className={`h-3 rounded-full overflow-hidden ${player.health >= 50 ? "bg-slate-700" : "bg-red-900/30"}`}
              />
              <div className={`absolute inset-0 rounded-full ${
                player.health >= 80 ? "bg-gradient-to-r from-green-400/20 to-green-500/20" :
                player.health >= 50 ? "bg-gradient-to-r from-yellow-400/20 to-orange-400/20" :
                "bg-gradient-to-r from-red-400/20 to-red-500/20"
              }`}></div>
            </div>
          </div>
        )}

        {/* Connection states with enhanced design */}
        {!isConnected && (
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3 text-yellow-400">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-sm">Connect Controller</div>
                <div className="text-xs text-yellow-300">Connect to load real player stats</div>
              </div>
            </div>
          </div>
        )}

        {isConnected && !player && (
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3 text-blue-400">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-sm">Creating Player</div>
                <div className="text-xs text-blue-300">Setting up your character...</div>
              </div>
            </div>
          </div>
        )}

        {isConnected && player && (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3 text-green-400">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-sm">Ready to Play!</div>
                <div className="text-xs text-green-300">Use actions to train and progress</div>
              </div>
            </div>
          </div>
        )}

        {/* Low health warning with enhanced design */}
        {player && player.health <= 20 && (
          <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-lg p-4 animate-pulse">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 rounded-lg bg-red-500/20">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-sm">⚠️ Low Health Warning</div>
                <div className="text-xs text-red-300">Rest to recover before mining</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}