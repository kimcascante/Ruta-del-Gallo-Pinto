import React, { useState, useEffect } from 'react';
import { GameTile } from './GameTile';
import { Player } from './Player';
import { GameMode, TileType, IngredientType, Player as PlayerType } from '../../types/game';

interface GameBoardProps {
  gameMode: GameMode;
  onTileClick: (x: number, y: number) => void;
  players?: PlayerType[];
  currentPlayerIndex?: number;
  ingredients?: Array<{x: number, y: number, type: IngredientType}>;
}

export const GameBoard: React.FC<GameBoardProps> = ({ 
  gameMode, 
  onTileClick, 
  players = [],
  currentPlayerIndex = 0,
  ingredients = []
}) => {
  const [boardSize] = useState(10);
  const [tiles, setTiles] = useState<TileType[][]>([]);

  // Initialize board with Costa Rican themed tiles
  useEffect(() => {
    const initializeBoard = () => {
      const newTiles: TileType[][] = [];
      
      for (let y = 0; y < boardSize; y++) {
        newTiles[y] = [];
        for (let x = 0; x < boardSize; x++) {
          // Create Costa Rican themed map
          if (x === 0 && y === 0) {
            newTiles[y][x] = TileType.START; // San José
          } else if (x === 9 && y === 9) {
            newTiles[y][x] = TileType.KITCHEN; // Final kitchen
          } else if (x === 2 && y === 3) {
            newTiles[y][x] = TileType.MINIGAME; // Surf in Playa Tamarindo
          } else if (x === 5 && y === 7) {
            newTiles[y][x] = TileType.MINIGAME; // Chaotic Kitchen
          } else if (x === 8 && y === 2) {
            newTiles[y][x] = TileType.MINIGAME; // Sazón Duel
          } else if (ingredients.some(ing => ing.x === x && ing.y === y)) {
            newTiles[y][x] = TileType.INGREDIENT;
          } else {
            // Random terrain based on Costa Rican regions
            const terrainTypes = [TileType.BEACH, TileType.JUNGLE, TileType.VOLCANO, TileType.MARKET];
            newTiles[y][x] = terrainTypes[Math.floor(Math.random() * terrainTypes.length)];
          }
        }
      }
      
      setTiles(newTiles);
    };

    initializeBoard();
  }, [boardSize, ingredients]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 relative">
        <div 
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
            width: `${boardSize * 50}px`,
            height: `${boardSize * 50}px`,
          }}
        >
          {tiles.map((row, y) =>
            row.map((tileType, x) => (
              <GameTile
                key={`${x}-${y}`}
                x={x}
                y={y}
                type={tileType}
                onClick={() => onTileClick(x, y)}
                hasIngredient={ingredients.some(ing => ing.x === x && ing.y === y)}
                ingredientType={ingredients.find(ing => ing.x === x && ing.y === y)?.type}
              />
            ))
          )}
        </div>
        
        {/* Render players on the board */}
        {players.map((player, index) => (
          <Player
            key={player.id}
            player={player}
            isCurrentPlayer={index === currentPlayerIndex}
          />
        ))}
      </div>
      
      {/* Game Mode Info */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">
          {gameMode === GameMode.ADVENTURE && "🏔️ Adventure Mode"}
          {gameMode === GameMode.COMPETITIVE && "⚔️ Competitive Mode"}
          {gameMode === GameMode.COOPERATIVE && "🤝 Cooperative Mode"}
          {gameMode === GameMode.NARRATIVE && "📖 Narrative Mode"}
        </h3>
        <p className="text-gray-300 text-sm">
          {gameMode === GameMode.ADVENTURE && "Visit regions and craft the best recipe"}
          {gameMode === GameMode.COMPETITIVE && "Control tiles and dominate the map"}
          {gameMode === GameMode.COOPERATIVE && "Team up to create a giant gallo pinto"}
          {gameMode === GameMode.NARRATIVE && "Build a story through minigames"}
        </p>
      </div>
    </div>
  );
}; 