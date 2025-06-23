// Interface definition
#[starknet::interface]
pub trait IGame<T> {
    // --------- Core gameplay methods ---------
    fn spawn_player(ref self: T);
    fn train(ref self: T);
    fn mine(ref self: T);
    fn rest(ref self: T);
}

use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use full_starter_react::store::{Store, StoreTrait};
use full_starter_react::models::{
    GameState, GameStateTrait, Player, PlayerTrait, Ingredient, IngredientTrait, BoardTile,
    BoardTileTrait, BOARD_WIDTH, BOARD_HEIGHT, MAX_PLAYERS
};

#[dojo::contract]
mod game {
    use super::{
        IWorldDispatcher, IWorldDispatcherTrait, Store, StoreTrait, GameState, GameStateTrait,
        Player, PlayerTrait, Ingredient, IngredientTrait, BoardTile, BoardTileTrait, BOARD_WIDTH,
        BOARD_HEIGHT, MAX_PLAYERS
    };
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        GameCreated: GameCreated,
        PlayerMoved: PlayerMoved,
        IngredientCollected: IngredientCollected,
    }

    #[derive(Drop, starknet::Event)]
    struct GameCreated {
        game_id: u32,
        creator: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct PlayerMoved {
        game_id: u32,
        player_index: u8,
        new_x: u8,
        new_y: u8,
    }

    #[derive(Drop, starknet::Event)]
    struct IngredientCollected {
        game_id: u32,
        player_index: u8,
        ingredient_id: u32,
        ingredient_type: u8,
    }

    #[external(v0)]
    impl GameImpl of IGame<ContractState> {
        fn init(self: @ContractState, world: IWorldDispatcher, game_id: u32) {
            let mut store = StoreTrait::new(world);
            let creator = get_caller_address();

            // Create game state
            let game_state = store.create_game_state(game_id, 0, MAX_PLAYERS, 50);

            // Create players
            store.create_player(game_id, 0, 'Player1', 0, 0);
            store.create_player(game_id, 1, 'Player2', 11, 11);

            // Initialize the board
            let mut y: u8 = 0;
            loop {
                if y >= BOARD_HEIGHT {
                    break;
                }
                let mut x: u8 = 0;
                loop {
                    if x >= BOARD_WIDTH {
                        break;
                    }
                    store.write_board_tile(
                        BoardTileTrait::new_regular(game_id, x, y, get_block_timestamp())
                    );
                    x += 1;
                };
                y += 1;
            };

            self.emit(GameCreated { game_id, creator });
        }

        fn move(self: @ContractState, world: IWorldDispatcher, game_id: u32, new_x: u8, new_y: u8) {
            let mut store = StoreTrait::new(world);
            let caller = get_caller_address();

            // Get game and player
            let game_state = store.read_game_state(game_id);
            let player_index = game_state.current_player_index;
            let mut player = store.read_player(game_id, player_index);

            assert(player.address == caller, "Not your turn");
            assert(new_x < BOARD_WIDTH && new_y < BOARD_HEIGHT, "Invalid coordinates");

            // TODO: Add adjacency check and energy cost
            player.move_to(new_x, new_y);
            store.write_player(player);

            // Check for ingredient on the new tile
            let tile = store.read_board_tile(game_id, new_x, new_y);
            if tile.has_ingredient {
                let mut ingredient = store.read_ingredient(game_id, tile.ingredient_id);
                if !ingredient.is_collected {
                    player.add_ingredient(ingredient.ingredient_type, 1);
                    ingredient.collect(caller);
                    store.write_ingredient(ingredient);
                    store.write_player(player);

                    self.emit(
                        IngredientCollected {
                            game_id,
                            player_index,
                            ingredient_id: ingredient.ingredient_id,
                            ingredient_type: ingredient.ingredient_type,
                        }
                    );
                }
            }

            // Update game state for next turn
            let mut new_game_state = game_state;
            new_game_state.next_turn();
            store.write_game_state(new_game_state);

            self.emit(PlayerMoved { game_id, player_index, new_x, new_y });
        }

        fn get_player(
            self: @ContractState, world: IWorldDispatcher, game_id: u32, player_index: u8
        ) -> Player {
            StoreTrait::new(world).read_player(game_id, player_index)
        }

        fn get_game_state(
            self: @ContractState, world: IWorldDispatcher, game_id: u32
        ) -> GameState {
            StoreTrait::new(world).read_game_state(game_id)
        }
    }
}