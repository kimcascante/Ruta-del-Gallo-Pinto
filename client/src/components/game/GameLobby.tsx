import React, { useState } from 'react';
import { GameMode } from '../../types/game';

interface GameLobbyProps {
  onStartGame: (gameMode: GameMode, playerCount: number) => void;
}

export const GameLobby: React.FC<GameLobbyProps> = ({ onStartGame }) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>(GameMode.ADVENTURE);
  const [playerCount, setPlayerCount] = useState(2);

  const gameModes = [
    {
      mode: GameMode.ADVENTURE,
      name: "🏔️ Adventure Mode",
      description: "Visit regions and craft the best recipe",
      details: "Explore Costa Rica's diverse regions, collect unique ingredients, and compete to create the most delicious gallo pinto recipe."
    },
    {
      mode: GameMode.COMPETITIVE,
      name: "⚔️ Competitive Mode", 
      description: "Control tiles and dominate the map",
      details: "Strategic gameplay where players compete for territory control, steal ingredients, and block opponents through minigames."
    },
    {
      mode: GameMode.COOPERATIVE,
      name: "🤝 Cooperative Mode",
      description: "Team up to create a giant gallo pinto",
      details: "Work together with other players to collect ingredients and complete a massive gallo pinto recipe against the clock."
    },
    {
      mode: GameMode.NARRATIVE,
      name: "📖 Narrative Mode",
      description: "Build a story through minigames",
      details: "Create an epic tale by completing minigames that add chapters to your story. Vote for the best narrative at the end."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-green-800 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🍳 Ruta del Gallo Pinto
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Embark on a culinary adventure through Costa Rica with your fellow dog chefs!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Game Mode Selection */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Select Game Mode</h2>
            <div className="space-y-4">
              {gameModes.map((gameMode) => (
                <div
                  key={gameMode.mode}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedMode === gameMode.mode
                      ? 'bg-green-600/20 border-green-400/50 shadow-lg'
                      : 'bg-white/5 border-white/20 hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedMode(gameMode.mode)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{gameMode.name.split(' ')[0]}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {gameMode.name}
                      </h3>
                      <p className="text-gray-300 text-sm mb-2">
                        {gameMode.description}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {gameMode.details}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Settings */}
          <div className="space-y-6">
            {/* Player Count */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Number of Players</h3>
              <div className="grid grid-cols-2 gap-4">
                {[2, 3, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => setPlayerCount(count)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      playerCount === count
                        ? 'bg-blue-600/20 border-blue-400/50 shadow-lg'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">
                        {Array.from({ length: count }).map(() => '🐕‍🦺').join(' ')}
                      </div>
                      <div className="text-white font-semibold">{count} Players</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Game Rules */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">How to Play</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">1.</span>
                  <span>Use arrow keys to move your dog chef around the map</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">2.</span>
                  <span>Collect ingredients (rice, beans, cilantro, salsa Lizano) from the map</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">3.</span>
                  <span>Land on minigame tiles to earn bonus points and special ingredients</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">4.</span>
                  <span>Craft recipes at kitchen tiles to earn points</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">5.</span>
                  <span>Each movement costs 1 movement point</span>
                </div>
              </div>
            </div>

            {/* Start Game Button */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <button
                onClick={() => onStartGame(selectedMode, playerCount)}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 px-8 rounded-lg font-bold text-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                🚀 Start Adventure
              </button>
              <p className="text-center text-gray-400 text-sm mt-2">
                Ready to explore Costa Rica's culinary wonders?
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>Experience the flavors of Costa Rica in this unique multiplayer board game!</p>
          <p className="mt-2">Built with ❤️ using Dojo Engine and React</p>
        </div>
      </div>
    </div>
  );
}; 