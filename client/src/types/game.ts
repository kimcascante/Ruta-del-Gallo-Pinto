export enum GameMode {
  ADVENTURE = 'adventure',
  COMPETITIVE = 'competitive',
  COOPERATIVE = 'cooperative',
  NARRATIVE = 'narrative'
}

export enum TileType {
  START = 'start',
  KITCHEN = 'kitchen',
  MINIGAME = 'minigame',
  INGREDIENT = 'ingredient',
  BEACH = 'beach',
  JUNGLE = 'jungle',
  VOLCANO = 'volcano',
  MARKET = 'market',
  NORMAL = 'normal'
}

export enum IngredientType {
  RICE = 'rice',
  BEANS = 'beans',
  CILANTRO = 'cilantro',
  SALSA_LIZANO = 'salsa_lizano'
}

export enum MinigameType {
  SURF_TAMARINDO = 'surf_tamarindo',
  CHAOTIC_KITCHEN = 'chaotic_kitchen',
  SAZON_DUEL = 'sazon_duel'
}

export interface Player {
  id: string;
  x: number;
  y: number;
  inventory: IngredientType[];
  score: number;
  movementPoints: number;
  isCurrentPlayer: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  gameMode: GameMode;
  board: TileType[][];
  ingredients: Array<{x: number, y: number, type: IngredientType}>;
  gamePhase: 'lobby' | 'playing' | 'minigame' | 'finished';
  minigameState?: {
    type: MinigameType;
    players: string[];
    timeRemaining: number;
  };
}

export interface Recipe {
  name: string;
  ingredients: IngredientType[];
  points: number;
  description: string;
}

export const RECIPES: Recipe[] = [
  {
    name: "Gallo Pinto Básico",
    ingredients: [IngredientType.RICE, IngredientType.BEANS],
    points: 50,
    description: "The classic Costa Rican breakfast"
  },
  {
    name: "Gallo Pinto Completo",
    ingredients: [IngredientType.RICE, IngredientType.BEANS, IngredientType.CILANTRO],
    points: 100,
    description: "Traditional gallo pinto with fresh cilantro"
  },
  {
    name: "Gallo Pinto Especial",
    ingredients: [IngredientType.RICE, IngredientType.BEANS, IngredientType.CILANTRO, IngredientType.SALSA_LIZANO],
    points: 200,
    description: "The ultimate gallo pinto with Salsa Lizano"
  }
]; 