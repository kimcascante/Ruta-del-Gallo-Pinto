import React from 'react';
import { IngredientType } from '../../types/game';

interface IngredientProps {
  type: IngredientType;
  x: number;
  y: number;
}

export const Ingredient: React.FC<IngredientProps> = ({ type, x, y }) => {
  const getIngredientIcon = () => {
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

  return (
    <div
      className="absolute w-6 h-6 flex items-center justify-center text-lg animate-pulse"
      style={{
        left: `${x * 48 + 16}px`,
        top: `${y * 48 + 16}px`,
        zIndex: 3,
      }}
    >
      {getIngredientIcon()}
    </div>
  );
}; 