import React from 'react';
import { TileType, IngredientType } from '../../types/game';

interface GameTileProps {
  x: number;
  y: number;
  type: TileType;
  onClick: () => void;
  hasIngredient?: boolean;
  ingredientType?: IngredientType;
}

export const GameTile: React.FC<GameTileProps> = ({ 
  x, 
  y, 
  type, 
  onClick, 
  hasIngredient, 
  ingredientType 
}) => {
  const getTileStyle = () => {
    const baseStyle = "w-12 h-12 rounded-md border-2 cursor-pointer transition-all duration-200 hover:scale-105 flex items-center justify-center text-white font-bold text-xs";
    
    switch (type) {
      case TileType.START:
        return `${baseStyle} bg-green-600 border-green-400`;
      case TileType.KITCHEN:
        return `${baseStyle} bg-orange-600 border-orange-400`;
      case TileType.MINIGAME:
        return `${baseStyle} bg-purple-600 border-purple-400`;
      case TileType.INGREDIENT:
        return `${baseStyle} bg-yellow-600 border-yellow-400`;
      case TileType.BEACH:
        return `${baseStyle} bg-blue-500 border-blue-300`;
      case TileType.JUNGLE:
        return `${baseStyle} bg-green-700 border-green-500`;
      case TileType.VOLCANO:
        return `${baseStyle} bg-red-700 border-red-500`;
      case TileType.MARKET:
        return `${baseStyle} bg-amber-600 border-amber-400`;
      default:
        return `${baseStyle} bg-gray-600 border-gray-400`;
    }
  };

  const getTileIcon = () => {
    switch (type) {
      case TileType.START:
        return "🏠";
      case TileType.KITCHEN:
        return "🍳";
      case TileType.MINIGAME:
        return "🎮";
      case TileType.BEACH:
        return "🏖️";
      case TileType.JUNGLE:
        return "🌴";
      case TileType.VOLCANO:
        return "🌋";
      case TileType.MARKET:
        return "🏪";
      default:
        return "";
    }
  };

  const getIngredientIcon = () => {
    switch (ingredientType) {
      case IngredientType.RICE:
        return "🍚";
      case IngredientType.BEANS:
        return "🫘";
      case IngredientType.CILANTRO:
        return "🌿";
      case IngredientType.SALSA_LIZANO:
        return "🥫";
      default:
        return "";
    }
  };

  return (
    <div 
      className={getTileStyle()}
      onClick={onClick}
      title={`${type} at (${x}, ${y})${hasIngredient ? ` - Contains ${ingredientType}` : ''}`}
    >
      <div className="relative">
        {getTileIcon()}
        {hasIngredient && (
          <div className="absolute -top-1 -right-1 text-lg">
            {getIngredientIcon()}
          </div>
        )}
      </div>
    </div>
  );
}; 