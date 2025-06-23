import React, { useState, useEffect, useCallback } from 'react';
import { GameBoard } from './GameBoard';
import { GameHUD } from './GameHUD';
import { GameLobby } from './GameLobby';
import { SurfMinigame } from '../minigames/SurfMinigame';
import { ChaoticKitchenMinigame } from '../minigames/ChaoticKitchenMinigame';
import { SazonDuelMinigame } from '../minigames/SazonDuelMinigame';
import { GameMode, Player, GameState, IngredientType, MinigameType, RECIPES } from '../../types/game';

export const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayerIndex: 0,
    gameMode: GameMode.ADVENTURE,
    board: [],
    ingredients: [],
    gamePhase: 'lobby'
  });
  
  const [showMinigame, setShowMinigame] = useState<MinigameType | null>(null);
  const [minigameResult, setMinigameResult] = useState<{success: boolean, points: number} | null>(null);

  // Initialize ingredients
  const initializeIngredients = useCallback(() => {
    return [
      { x: 4, y: 4, type: IngredientType.RICE },
      { x: 6, y: 1, type: IngredientType.BEANS },
      { x: 1, y: 8, type: IngredientType.CILANTRO },
      { x: 7, y: 6, type: IngredientType.SALSA_LIZANO },
    ];
  }, []);

  // Initialize game
  const startGame = useCallback((gameMode: GameMode, playerCount: number) => {
    const players: Player[] = [];
    
    for (let i = 0; i < playerCount; i++) {
      players.push({
        id: `player-${i}`,
        x: 0,
        y: 0,
        inventory: [],
        score: 0,
        movementPoints: 10,
        isCurrentPlayer: i === 0
      });
    }

    setGameState({
      players,
      currentPlayerIndex: 0,
      gameMode,
      board: [],
      ingredients: initializeIngredients(),
      gamePhase: 'playing'
    });
  }, [initializeIngredients]);

  // Handle tile click (movement)
  const handleTileClick = useCallback((x: number, y: number) => {
    if (gameState.gamePhase !== 'playing') return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.movementPoints <= 0) return;

    // Check if tile is adjacent
    const dx = Math.abs(x - currentPlayer.x);
    const dy = Math.abs(y - currentPlayer.y);
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      // Move player
      const updatedPlayers = gameState.players.map((player, index) => {
        if (index === gameState.currentPlayerIndex) {
          return {
            ...player,
            x,
            y,
            movementPoints: player.movementPoints - 1
          };
        }
        return player;
      });

      setGameState(prev => ({
        ...prev,
        players: updatedPlayers
      }));

      // Check for ingredient collection
      const ingredient = gameState.ingredients.find(ing => ing.x === x && ing.y === y);
      if (ingredient) {
        const playerWithIngredient = updatedPlayers[gameState.currentPlayerIndex];
        const newInventory = [...playerWithIngredient.inventory, ingredient.type];
        
        setGameState(prev => ({
          ...prev,
          players: prev.players.map((player, index) => 
            index === gameState.currentPlayerIndex 
              ? { ...player, inventory: newInventory, score: player.score + 10 }
              : player
          ),
          ingredients: prev.ingredients.filter(ing => !(ing.x === x && ing.y === y))
        }));
      }

      // Check for minigame tile
      if (x === 2 && y === 3) {
        setShowMinigame(MinigameType.SURF_TAMARINDO);
      } else if (x === 5 && y === 7) {
        setShowMinigame(MinigameType.CHAOTIC_KITCHEN);
      } else if (x === 8 && y === 2) {
        setShowMinigame(MinigameType.SAZON_DUEL);
      }
    }
  }, [gameState]);

  // Handle end turn
  const handleEndTurn = useCallback(() => {
    const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    
    setGameState(prev => ({
      ...prev,
      players: prev.players.map((player, index) => ({
        ...player,
        isCurrentPlayer: index === nextPlayerIndex,
        movementPoints: index === nextPlayerIndex ? 10 : player.movementPoints
      })),
      currentPlayerIndex: nextPlayerIndex
    }));
  }, [gameState.currentPlayerIndex, gameState.players.length]);

  // Handle recipe crafting
  const handleCraftRecipe = useCallback((recipeIndex: number) => {
    const recipe = RECIPES[recipeIndex];
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    if (!currentPlayer) return;

    // Check if player has ingredients
    const inventory = [...currentPlayer.inventory];
    let canCraft = true;
    
    for (const ingredient of recipe.ingredients) {
      const index = inventory.indexOf(ingredient);
      if (index === -1) {
        canCraft = false;
        break;
      }
      inventory.splice(index, 1);
    }

    if (canCraft) {
      setGameState(prev => ({
        ...prev,
        players: prev.players.map((player, index) => 
          index === gameState.currentPlayerIndex 
            ? { 
                ...player, 
                inventory, 
                score: player.score + recipe.points 
              }
            : player
        )
      }));
    }
  }, [gameState.currentPlayerIndex, gameState.players]);

  // Handle minigame completion
  const handleMinigameComplete = useCallback((success: boolean, points: number) => {
    setShowMinigame(null);
    setMinigameResult({ success, points });

    if (success) {
      setGameState(prev => ({
        ...prev,
        players: prev.players.map((player, index) => 
          index === gameState.currentPlayerIndex 
            ? { 
                ...player, 
                score: player.score + points,
                inventory: [...player.inventory, IngredientType.CILANTRO] // Bonus ingredient
              }
            : player
        )
      }));
    }

    // Clear result after 3 seconds
    setTimeout(() => setMinigameResult(null), 3000);
  }, [gameState.currentPlayerIndex]);

  // Handle keyboard input for movement
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.gamePhase !== 'playing' || showMinigame) return;

      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      if (!currentPlayer || currentPlayer.movementPoints <= 0) return;

      let newX = currentPlayer.x;
      let newY = currentPlayer.y;

      switch (event.key) {
        case 'ArrowUp':
          newY = Math.max(0, currentPlayer.y - 1);
          break;
        case 'ArrowDown':
          newY = Math.min(9, currentPlayer.y + 1);
          break;
        case 'ArrowLeft':
          newX = Math.max(0, currentPlayer.x - 1);
          break;
        case 'ArrowRight':
          newX = Math.min(9, currentPlayer.x + 1);
          break;
        default:
          return;
      }

      if (newX !== currentPlayer.x || newY !== currentPlayer.y) {
        handleTileClick(newX, newY);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, showMinigame, handleTileClick]);

  // Render minigame
  const renderMinigame = () => {
    switch (showMinigame) {
      case MinigameType.SURF_TAMARINDO:
        return <SurfMinigame onComplete={handleMinigameComplete} onClose={() => setShowMinigame(null)} />;
      case MinigameType.CHAOTIC_KITCHEN:
        return <ChaoticKitchenMinigame onComplete={handleMinigameComplete} onClose={() => setShowMinigame(null)} />;
      case MinigameType.SAZON_DUEL:
        return <SazonDuelMinigame onComplete={handleMinigameComplete} onClose={() => setShowMinigame(null)} />;
      default:
        return null;
    }
  };

  // Render game result notification
  const renderMinigameResult = () => {
    if (!minigameResult) return null;

    return (
      <div className="fixed top-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 z-50">
        <div className={`text-lg font-semibold ${minigameResult.success ? 'text-green-400' : 'text-red-400'}`}>
          {minigameResult.success ? '🎉 Success!' : '😔 Try Again!'}
        </div>
        <div className="text-white">
          Points earned: {minigameResult.points}
        </div>
      </div>
    );
  };

  // Show lobby if game hasn't started
  if (gameState.gamePhase === 'lobby') {
    return <GameLobby onStartGame={startGame} />;
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-green-800 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-white">🍳 Ruta del Gallo Pinto</h1>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
              <span className="text-gray-300 text-sm">
                {gameState.gameMode === GameMode.ADVENTURE && "🏔️ Adventure Mode"}
                {gameState.gameMode === GameMode.COMPETITIVE && "⚔️ Competitive Mode"}
                {gameState.gameMode === GameMode.COOPERATIVE && "🤝 Cooperative Mode"}
                {gameState.gameMode === GameMode.NARRATIVE && "📖 Narrative Mode"}
              </span>
            </div>
          </div>
          <button
            onClick={() => setGameState(prev => ({ ...prev, gamePhase: 'lobby' }))}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Back to Lobby
          </button>
        </div>

        {/* Game Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Game Board */}
          <div className="lg:col-span-3">
            <GameBoard 
              gameMode={gameState.gameMode}
              onTileClick={handleTileClick}
              players={gameState.players}
              currentPlayerIndex={gameState.currentPlayerIndex}
              ingredients={gameState.ingredients}
            />
          </div>

          {/* Game HUD */}
          <div className="lg:col-span-1">
            {currentPlayer && (
              <GameHUD
                currentPlayer={currentPlayer}
                allPlayers={gameState.players}
                onEndTurn={handleEndTurn}
                onCraftRecipe={handleCraftRecipe}
              />
            )}
          </div>
        </div>
      </div>

      {/* Minigame Overlay */}
      {renderMinigame()}

      {/* Minigame Result Notification */}
      {renderMinigameResult()}
    </div>
  );
}; 