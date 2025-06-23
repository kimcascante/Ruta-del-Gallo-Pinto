import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dumbbell, Hammer, Bed, Loader2, ExternalLink, Sparkles, Target, Shield } from "lucide-react";
import { useTrainAction } from "../dojo/hooks/useTrainAction";
import { useMineAction } from "../dojo/hooks/useMineAction";
import { useRestAction } from "../dojo/hooks/useRestAction";
import useAppStore from "../zustand/store";

export function GameActions() {
  const player = useAppStore((state) => state.player);

  // Separate hooks for each action
  const { trainState, executeTrain, canTrain } = useTrainAction();
  const { mineState, executeMine, canMine } = useMineAction();
  const { restState, executeRest, canRest } = useRestAction();

  const actions = [
    {
      icon: Dumbbell,
      label: "Train",
      description: "Gain experience and level up",
      effect: "+10 EXP",
      onClick: executeTrain,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-500/30",
      state: trainState,
      canExecute: canTrain,
      category: "Progression"
    },
    {
      icon: Hammer,
      label: "Mine",
      description: "Risk health for valuable coins",
      effect: "+5 Coins, -5 Health",
      onClick: executeMine,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-500/20 to-yellow-600/20",
      borderColor: "border-yellow-500/30",
      state: mineState,
      canExecute: canMine,
      category: "Risk/Reward",
      disabledReason:
        !canMine && player && (player.health || 0) <= 5
          ? "Low Health!"
          : undefined,
    },
    {
      icon: Bed,
      label: "Rest",
      description: "Recover health and stamina",
      effect: "+20 Health",
      onClick: executeRest,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-500/20 to-green-600/20",
      borderColor: "border-green-500/30",
      state: restState,
      canExecute: canRest,
      category: "Recovery",
      disabledReason:
        !canRest && player && (player.health || 0) >= 100
          ? "Full Health!"
          : undefined,
    },
  ];

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
          <Target className="w-6 h-6 text-purple-400" />
          Game Actions
          <span className="text-sm text-slate-400 ml-auto">
            {player ? "Ready to play!" : "Connect to start"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!player && (
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-6 text-center">
            <div className="text-purple-400 text-lg mb-2">🎮 Connect Your Controller</div>
            <div className="text-slate-300 text-sm">
              Use Cartridge Controller to connect your wallet and start playing
            </div>
          </div>
        )}

        {/* Action categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            const isLoading = action.state.isLoading;
            const hasError = Boolean(action.state.error);

            return (
              <div key={action.label} className="space-y-3">
                {/* Action card */}
                <div className={`relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-105 ${
                  action.canExecute && !isLoading 
                    ? `bg-gradient-to-br ${action.bgColor} ${action.borderColor}` 
                    : 'bg-white/5 border-white/10'
                }`}>
                  
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_50%)]"></div>
                  </div>

                  <div className="relative p-6">
                    {/* Category badge */}
                    <div className="absolute top-3 right-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-slate-300">
                        {action.category}
                      </span>
                    </div>

                    {/* Icon and title */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${action.color} shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{action.label}</h3>
                        <p className="text-slate-300 text-sm">{action.description}</p>
                      </div>
                    </div>

                    {/* Effect display */}
                    <div className="bg-white/10 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-semibold">{action.effect}</span>
                      </div>
                    </div>

                    {/* Action button */}
                    <Button
                      onClick={action.onClick}
                      disabled={!action.canExecute || isLoading}
                      className={`w-full h-12 bg-gradient-to-r ${action.color} hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold`}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <Icon className="w-5 h-5 mr-2" />
                      )}
                      {isLoading ? "Processing..." : action.label}
                    </Button>

                    {/* Disabled reason */}
                    {action.disabledReason && (
                      <div className="mt-2 text-center">
                        <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">
                          {action.disabledReason}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Transaction status */}
                {(action.state.txStatus || hasError) && (
                  <div
                    className={`p-4 rounded-lg border text-sm ${
                      hasError
                        ? "bg-red-500/10 border-red-500/30 text-red-400"
                        : action.state.txStatus === "SUCCESS"
                          ? "bg-green-500/10 border-green-500/30 text-green-400"
                          : "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                    }`}
                  >
                    {hasError ? (
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span>Error: {action.state.error}</span>
                      </div>
                    ) : action.state.txStatus === "SUCCESS" ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          <span>{action.label} completed successfully!</span>
                        </div>
                        {action.state.txHash && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-mono bg-black/20 px-2 py-1 rounded">
                              {formatAddress(action.state.txHash)}
                            </span>
                            <a
                              href={`https://sepolia.starkscan.co/tx/${action.state.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Processing {action.label}...</span>
                        </div>
                        {action.state.txHash && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-mono bg-black/20 px-2 py-1 rounded">
                              {formatAddress(action.state.txHash)}
                            </span>
                            <a
                              href={`https://sepolia.starkscan.co/tx/${action.state.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Live
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
