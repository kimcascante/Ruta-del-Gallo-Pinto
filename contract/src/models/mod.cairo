// Models module for Ruta del Gallo Pinto game
// This module exports all the game models and their traits

mod game_state;
mod player;
mod ingredient;
mod recipe;
mod minigame;
mod board_tile;

// Re-export all models
pub use game_state::{GameState, GameStateTrait, GameStateAssert, ZeroableGameStateTrait};
pub use player::{Player, PlayerTrait, PlayerAssert, ZeroablePlayerTrait};
pub use ingredient::{Ingredient, IngredientTrait, IngredientAssert, ZeroableIngredientTrait};
pub use recipe::{Recipe, RecipeTrait, RecipeAssert, ZeroableRecipeTrait};
pub use minigame::{Minigame, MinigameTrait, MinigameAssert, ZeroableMinigameTrait};
pub use board_tile::{BoardTile, BoardTileTrait, BoardTileAssert, ZeroableBoardTileTrait};

// Game constants
pub const GAME_MODES: (u8, u8, u8, u8) = (0, 1, 2, 3); // Adventure, Competitive, Cooperative, Narrative
pub const GAME_PHASES: (u8, u8, u8, u8) = (0, 1, 2, 3); // Lobby, Playing, Minigame, Finished
pub const INGREDIENT_TYPES: (u8, u8, u8, u8) = (0, 1, 2, 3); // Rice, Beans, Cilantro, Salsa Lizano
pub const MINIGAME_TYPES: (u8, u8, u8) = (0, 1, 2); // Surf, Chaotic Kitchen, Sazón Duel
pub const TILE_TYPES: (u8, u8, u8, u8, u8) = (0, 1, 2, 3, 4); // Regular, Ingredient, Minigame, Special, Obstacle

// Board dimensions
pub const BOARD_WIDTH: u8 = 12;
pub const BOARD_HEIGHT: u8 = 12;
pub const MAX_PLAYERS: u8 = 6;
pub const MAX_TURNS: u32 = 50;

// Ingredient spawn rates (percentages)
pub const RICE_SPAWN_RATE: u8 = 40;
pub const BEANS_SPAWN_RATE: u8 = 35;
pub const CILANTRO_SPAWN_RATE: u8 = 20;
pub const SALSA_SPAWN_RATE: u8 = 5;

// Recipe requirements
pub const GALLO_PINTO_RICE: u8 = 2;
pub const GALLO_PINTO_BEANS: u8 = 2;
pub const GALLO_PINTO_CILANTRO: u8 = 1;
pub const GALLO_PINTO_SALSA: u8 = 0;

pub const CASADO_RICE: u8 = 1;
pub const CASADO_BEANS: u8 = 1;
pub const CASADO_CILANTRO: u8 = 0;
pub const CASADO_SALSA: u8 = 1;

// Scoring
pub const BASE_RECIPE_SCORE: u32 = 100;
pub const INGREDIENT_COLLECTION_SCORE: u32 = 10;
pub const MINIGAME_WIN_SCORE: u32 = 200;
pub const SPECIAL_TILE_SCORE: u32 = 50;

// Player stats
pub const STARTING_HEALTH: u8 = 100;
pub const STARTING_ENERGY: u8 = 50;
pub const MAX_HEALTH: u8 = 100;
pub const MAX_ENERGY: u8 = 100;

// Movement costs
pub const REGULAR_TILE_COST: u8 = 1;
pub const MINIGAME_TILE_COST: u8 = 2;
pub const SPECIAL_TILE_COST: u8 = 1;

// Minigame durations (in seconds)
pub const SURF_DURATION: u32 = 120;
pub const CHAOTIC_KITCHEN_DURATION: u32 = 180;
pub const SAZON_DUEL_DURATION: u32 = 90;

// Minigame player limits
pub const SURF_MAX_PLAYERS: u8 = 4;
pub const CHAOTIC_KITCHEN_MAX_PLAYERS: u8 = 6;
pub const SAZON_DUEL_MAX_PLAYERS: u8 = 2; 