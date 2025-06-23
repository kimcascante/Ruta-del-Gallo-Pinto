// Starknet imports
use starknet::{ContractAddress, get_caller_address, get_block_timestamp};

// Dojo imports
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use dojo::model::ModelStorage;

// Models imports
use full_starter_react::models::{
    Player, PlayerTrait, GameState, GameStateTrait, BoardTile, BoardTileTrait, Ingredient,
    IngredientTrait, Recipe, RecipeTrait, Minigame, MinigameTrait
};

// Helpers import
use full_starter_react::helpers::timestamp::Timestamp;
use full_starter_react::constants;

// Store struct
#[derive(Copy, Drop, Serde)]
pub struct Store {
    world: IWorldDispatcher,
}

//Implementation of the `StoreTrait` trait for the `Store` struct
#[generate_trait]
pub impl StoreImpl of StoreTrait {
    fn new(world: IWorldDispatcher) -> Store {
        Store { world }
    }

    // Player functions
    fn read_player(self: @Store, game_id: u32, player_index: u8) -> Player {
        self.world.read_model((game_id, player_index))
    }

    fn write_player(self: @Store, player: Player) {
        self.world.write_model(player)
    }

    fn create_player(
        self: @Store, game_id: u32, player_index: u8, name: felt252, pos_x: u8, pos_y: u8
    ) -> Player {
        let caller = get_caller_address();
        let current_timestamp = get_block_timestamp();
        let new_player = PlayerTrait::new(
            game_id, player_index, caller, name, pos_x, pos_y, current_timestamp
        );
        self.world.write_model(@new_player);
        new_player
    }

    // GameState functions
    fn read_game_state(self: @Store, game_id: u32) -> GameState {
        self.world.read_model(game_id)
    }

    fn write_game_state(self: @Store, game_state: GameState) {
        self.world.write_model(game_state)
    }

    fn create_game_state(
        self: @Store, game_id: u32, game_mode: u8, total_players: u8, max_turns: u32
    ) -> GameState {
        let current_timestamp = get_block_timestamp();
        let new_game_state = GameStateTrait::new(
            game_id, game_mode, total_players, max_turns, current_timestamp
        );
        self.world.write_model(@new_game_state);
        new_game_state
    }

    // Ingredient functions
    fn read_ingredient(self: @Store, game_id: u32, ingredient_id: u32) -> Ingredient {
        self.world.read_model((game_id, ingredient_id))
    }

    fn write_ingredient(self: @Store, ingredient: Ingredient) {
        self.world.write_model(ingredient)
    }

    // Recipe functions
    fn read_recipe(self: @Store, recipe_id: u32) -> Recipe {
        self.world.read_model(recipe_id)
    }

    fn write_recipe(self: @Store, recipe: Recipe) {
        self.world.write_model(recipe)
    }

    // Minigame functions
    fn read_minigame(self: @Store, game_id: u32, minigame_id: u32) -> Minigame {
        self.world.read_model((game_id, minigame_id))
    }

    fn write_minigame(self: @Store, minigame: Minigame) {
        self.world.write_model(minigame)
    }

    // BoardTile functions
    fn read_board_tile(self: @Store, game_id: u32, pos_x: u8, pos_y: u8) -> BoardTile {
        self.world.read_model((game_id, pos_x, pos_y))
    }

    fn write_board_tile(self: @Store, board_tile: BoardTile) {
        self.world.write_model(board_tile)
    }

    // --------- Game Actions ---------
    fn train_player(mut self: Store) {
        let mut player = self.read_player();
        
        // Add experience from training
        player.add_experience(10);
        
        self.world.write_model(@player);
    }

    fn mine_coins(mut self: Store) {
        let mut player = self.read_player();
        
        // Add coins and reduce health from mining
        player.add_coins(5);
        
        // Reduce health (ensure it doesn't go below 0)
        if player.health >= 5 {
            player.health -= 5;
        } else {
            player.health = 0;
        }
        
        self.world.write_model(@player);
    }

    fn rest_player(mut self: Store) {
        let mut player = self.read_player();
        
        // Add health from resting
        player.add_health(20);
        
        self.world.write_model(@player);
    }
    
}