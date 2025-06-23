// Starknet import
use starknet::ContractAddress;
use core::num::traits::zero::Zero;

// Constants imports
use full_starter_react::constants;

// Model
#[derive(Copy, Drop, Serde, IntrospectPacked, Debug)]
#[dojo::model]
pub struct GameState {
    #[key]
    pub game_id: u32,
    pub game_mode: u8, // 0=Adventure, 1=Competitive, 2=Cooperative, 3=Narrative
    pub current_player_index: u8,
    pub total_players: u8,
    pub game_phase: u8, // 0=Lobby, 1=Playing, 2=Minigame, 3=Finished
    pub turn_number: u32,
    pub max_turns: u32,
    pub created_at: u64,
    pub updated_at: u64,
}

// Traits Implementations
#[generate_trait]
pub impl GameStateImpl of GameStateTrait {
    fn new(
        game_id: u32,
        game_mode: u8,
        total_players: u8,
        max_turns: u32,
        created_at: u64,
    ) -> GameState {
        GameState {
            game_id: game_id,
            game_mode: game_mode,
            current_player_index: 0,
            total_players: total_players,
            game_phase: 1, // Start in playing phase
            turn_number: 1,
            max_turns: max_turns,
            created_at: created_at,
            updated_at: created_at,
        }
    }

    fn next_turn(ref self: GameState) {
        self.current_player_index = (self.current_player_index + 1) % self.total_players;
        if self.current_player_index == 0 {
            self.turn_number += 1;
        }
        self.updated_at = starknet::get_block_timestamp();
    }

    fn set_game_phase(ref self: GameState, phase: u8) {
        self.game_phase = phase;
        self.updated_at = starknet::get_block_timestamp();
    }

    fn is_game_finished(self: @GameState) -> bool {
        self.turn_number > self.max_turns || self.game_phase == 3
    }
}

#[generate_trait]
pub impl GameStateAssert of AssertTrait {
    #[inline(always)]
    fn assert_exists(self: GameState) {
        assert(self.is_non_zero(), 'GameState: Does not exist');
    }

    #[inline(always)]
    fn assert_not_exists(self: GameState) {
        assert(self.is_zero(), 'GameState: Already exists');
    }
}

pub impl ZeroableGameStateTrait of Zero<GameState> {
    #[inline(always)]
    fn zero() -> GameState {
        GameState {
            game_id: 0,
            game_mode: 0,
            current_player_index: 0,
            total_players: 0,
            game_phase: 0,
            turn_number: 0,
            max_turns: 0,
            created_at: 0,
            updated_at: 0,
        }
    }

    #[inline(always)]
    fn is_zero(self: @GameState) -> bool {
        *self.game_id == 0
    }

    #[inline(always)]
    fn is_non_zero(self: @GameState) -> bool {
        !self.is_zero()
    }
}

// Tests
#[cfg(test)]
mod tests {
    use super::{GameState, ZeroableGameStateTrait, GameStateImpl, GameStateTrait, GameStateAssert};
    use full_starter_react::constants;

    #[test]
    #[available_gas(1000000)]
    fn test_game_state_new() {
        let game_state = GameStateTrait::new(
            1,    // game_id
            0,    // game_mode (Adventure)
            4,    // total_players
            20,   // max_turns
            1234567890, // created_at
        );

        assert_eq!(game_state.game_id, 1, "Game ID should be 1");
        assert_eq!(game_state.game_mode, 0, "Game mode should be Adventure");
        assert_eq!(game_state.total_players, 4, "Total players should be 4");
        assert_eq!(game_state.current_player_index, 0, "Current player should start at 0");
        assert_eq!(game_state.game_phase, 1, "Game phase should start at playing");
        assert_eq!(game_state.turn_number, 1, "Turn number should start at 1");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_next_turn() {
        let mut game_state = GameStateTrait::new(
            1,    // game_id
            0,    // game_mode
            3,    // total_players
            10,   // max_turns
            1234567890, // created_at
        );

        // First turn
        GameStateTrait::next_turn(ref game_state);
        assert_eq!(game_state.current_player_index, 1, "Should move to player 1");
        assert_eq!(game_state.turn_number, 1, "Turn number should still be 1");

        // Second turn
        GameStateTrait::next_turn(ref game_state);
        assert_eq!(game_state.current_player_index, 2, "Should move to player 2");
        assert_eq!(game_state.turn_number, 1, "Turn number should still be 1");

        // Third turn - should wrap around and increment turn number
        GameStateTrait::next_turn(ref game_state);
        assert_eq!(game_state.current_player_index, 0, "Should wrap back to player 0");
        assert_eq!(game_state.turn_number, 2, "Turn number should increment to 2");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_set_game_phase() {
        let mut game_state = GameStateTrait::new(
            1,    // game_id
            0,    // game_mode
            2,    // total_players
            10,   // max_turns
            1234567890, // created_at
        );

        GameStateTrait::set_game_phase(ref game_state, 2); // Minigame phase
        assert_eq!(game_state.game_phase, 2, "Game phase should be set to minigame");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_is_game_finished() {
        let mut game_state = GameStateTrait::new(
            1,    // game_id
            0,    // game_mode
            2,    // total_players
            5,    // max_turns
            1234567890, // created_at
        );

        // Game should not be finished initially
        assert(!GameStateTrait::is_game_finished(@game_state), "Game should not be finished initially");

        // Set to finished phase
        GameStateTrait::set_game_phase(ref game_state, 3);
        assert(GameStateTrait::is_game_finished(@game_state), "Game should be finished when phase is 3");
    }
} 