import React from 'react';
import { Player, IngredientType, RECIPES } from '../../types/game';

interface GameHUDProps {
  currentPlayer: Player;
  allPlayers: Player[];
  onEndTurn: () => void;
  onCraftRecipe: (recipeIndex: number) => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({ 
  currentPlayer, 
  allPlayers, 
  onEndTurn, 
  onCraftRecipe 
}) => {
  const getIngredientIcon = (type: IngredientType) => {
    switch (type) {
      case IngredientType.RICE:
        return "🍚";
      case IngredientType.BEANS:
        return "🫘";
      case IngredientType.CILANTRO:
        return "🌿";
      case IngredientType.SALSA_LIZANO:
        return "🥫";
    }
  };

  const getIngredientName = (type: IngredientType) => {
    switch (type) {
      case IngredientType.RICE:
        return "Rice";
      case IngredientType.BEANS:
        return "Beans";
      case IngredientType.CILANTRO:
        return "Cilantro";
      case IngredientType.SALSA_LIZANO:
        return "Salsa Lizano";
    }
  };

  const canCraftRecipe = (recipe: typeof RECIPES[0]) => {
    const inventory = [...currentPlayer.inventory];
    for (const ingredient of recipe.ingredients) {
      const index = inventory.indexOf(ingredient);
      if (index === -1) return false;
      inventory.splice(index, 1);
    }
    return true;
  };

  const getInventoryCount = (type: IngredientType) => {
    return currentPlayer.inventory.filter(ing => ing === type).length;
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Current Player Stats */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Current Player</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-300">Score:</span>
            <span className="text-white font-semibold ml-2">{currentPlayer.score}</span>
          </div>
          <div>
            <span className="text-gray-300">Movement:</span>
            <span className="text-white font-semibold ml-2">{currentPlayer.movementPoints}</span>
          </div>
          <div>
            <span className="text-gray-300">Position:</span>
            <span className="text-white font-semibold ml-2">({currentPlayer.x}, {currentPlayer.y})</span>
          </div>
          <div>
            <span className="text-gray-300">Ingredients:</span>
            <span className="text-white font-semibold ml-2">{currentPlayer.inventory.length}</span>
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Inventory</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(IngredientType).map(type => (
            <div key={type} className="flex items-center justify-between bg-white/5 rounded p-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getIngredientIcon(type)}</span>
                <span className="text-gray-300 text-sm">{getIngredientName(type)}</span>
              </div>
              <span className="text-white font-semibold">{getInventoryCount(type)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recipes */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Recipes</h3>
        <div className="space-y-2">
          {RECIPES.map((recipe, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg border ${
                canCraftRecipe(recipe) 
                  ? 'bg-green-600/20 border-green-400/30 cursor-pointer hover:bg-green-600/30' 
                  : 'bg-gray-600/20 border-gray-400/30'
              }`}
              onClick={() => canCraftRecipe(recipe) && onCraftRecipe(index)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-semibold">{recipe.name}</span>
                <span className="text-yellow-400 font-bold">+{recipe.points}</span>
              </div>
              <div className="flex items-center space-x-1 mb-1">
                {recipe.ingredients.map((ing, i) => (
                  <span key={i} className="text-sm">
                    {getIngredientIcon(ing)}
                  </span>
                ))}
              </div>
              <p className="text-gray-300 text-xs">{recipe.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* All Players */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">All Players</h3>
        <div className="space-y-2">
          {allPlayers.map((player, index) => (
            <div 
              key={player.id} 
              className={`flex items-center justify-between p-2 rounded ${
                player.isCurrentPlayer ? 'bg-blue-600/20 border border-blue-400/30' : 'bg-gray-600/20'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm">🐕‍🦺</span>
                <span className="text-white text-sm">Player {index + 1}</span>
                {player.isCurrentPlayer && <span className="text-yellow-400 text-xs">●</span>}
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className="text-gray-300">Score: {player.score}</span>
                <span className="text-gray-300">MP: {player.movementPoints}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Actions */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Actions</h3>
        <div className="space-y-2">
          <button
            onClick={onEndTurn}
            disabled={currentPlayer.movementPoints <= 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-semibold transition-colors"
          >
            End Turn
          </button>
        </div>
      </div>
    </div>
  );
}; 