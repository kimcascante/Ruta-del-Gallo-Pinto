// Starknet import
use starknet::ContractAddress;
use core::num::traits::zero::Zero;

// Constants imports
use full_starter_react::constants;

// Model
#[derive(Copy, Drop, Serde, IntrospectPacked, Debug)]
#[dojo::model]
pub struct Minigame {
    #[key]
    pub game_id: u32,
    #[key]
    pub minigame_id: u32,
    pub minigame_type: u8, // 0=Surf, 1=Chaotic Kitchen, 2=Sazón Duel
    pub name: felt252,
    pub description: felt252,
    pub is_active: bool,
    pub current_players: u8,
    pub max_players: u8,
    pub duration_seconds: u32,
    pub start_time: u64,
    pub end_time: u64,
    pub winner: ContractAddress,
    pub winner_score: u32,
    pub total_participants: u8,
    pub created_at: u64,
    pub updated_at: u64,
}

// Traits Implementations
#[generate_trait]
pub impl MinigameImpl of MinigameTrait {
    fn new_surf(game_id: u32, minigame_id: u32, created_at: u64) -> Minigame {
        Minigame {
            game_id: game_id,
            minigame_id: minigame_id,
            minigame_type: 0,
            name: 'Surf_in_Playa_Tamarindo',
            description: 'Catch_the_best_waves_and_perform_tricks',
            is_active: false,
            current_players: 0,
            max_players: 4,
            duration_seconds: 120, // 2 minutes
            start_time: 0,
            end_time: 0,
            winner: starknet::contract_address_const::<0>(),
            winner_score: 0,
            total_participants: 0,
            created_at: created_at,
            updated_at: created_at,
        }
    }

    fn new_chaotic_kitchen(game_id: u32, minigame_id: u32, created_at: u64) -> Minigame {
        Minigame {
            game_id: game_id,
            minigame_id: minigame_id,
            minigame_type: 1,
            name: 'Chaotic_Kitchen',
            description: 'Cook_as_many_dishes_as_possible_in_chaos',
            is_active: false,
            current_players: 0,
            max_players: 6,
            duration_seconds: 180, // 3 minutes
            start_time: 0,
            end_time: 0,
            winner: starknet::contract_address_const::<0>(),
            winner_score: 0,
            total_participants: 0,
            created_at: created_at,
            updated_at: created_at,
        }
    }

    fn new_sazon_duel(game_id: u32, minigame_id: u32, created_at: u64) -> Minigame {
        Minigame {
            game_id: game_id,
            minigame_id: minigame_id,
            minigame_type: 2,
            name: 'Sazon_Duel',
            description: 'One_on_one_cooking_battle_for_the_best_flavor',
            is_active: false,
            current_players: 0,
            max_players: 2,
            duration_seconds: 90, // 1.5 minutes
            start_time: 0,
            end_time: 0,
            winner: starknet::contract_address_const::<0>(),
            winner_score: 0,
            total_participants: 0,
            created_at: created_at,
            updated_at: created_at,
        }
    }

    fn new_custom(
        game_id: u32,
        minigame_id: u32,
        minigame_type: u8,
        name: felt252,
        description: felt252,
        max_players: u8,
        duration_seconds: u32,
        created_at: u64,
    ) -> Minigame {
        Minigame {
            game_id: game_id,
            minigame_id: minigame_id,
            minigame_type: minigame_type,
            name: name,
            description: description,
            is_active: false,
            current_players: 0,
            max_players: max_players,
            duration_seconds: duration_seconds,
            start_time: 0,
            end_time: 0,
            winner: starknet::contract_address_const::<0>(),
            winner_score: 0,
            total_participants: 0,
            created_at: created_at,
            updated_at: created_at,
        }
    }

    fn start_minigame(ref self: Minigame) {
        self.is_active = true;
        self.start_time = starknet::get_block_timestamp();
        self.end_time = self.start_time + self.duration_seconds.into();
        self.updated_at = starknet::get_block_timestamp();
    }

    fn end_minigame(ref self: Minigame, winner: ContractAddress, winner_score: u32) {
        self.is_active = false;
        self.winner = winner;
        self.winner_score = winner_score;
        self.end_time = starknet::get_block_timestamp();
        self.updated_at = starknet::get_block_timestamp();
    }

    fn add_player(ref self: Minigame) -> bool {
        if self.current_players < self.max_players && !self.is_active {
            self.current_players += 1;
            self.total_participants += 1;
            self.updated_at = starknet::get_block_timestamp();
            true
        } else {
            false
        }
    }

    fn remove_player(ref self: Minigame) -> bool {
        if self.current_players > 0 && !self.is_active {
            self.current_players -= 1;
            self.updated_at = starknet::get_block_timestamp();
            true
        } else {
            false
        }
    }

    fn is_full(self: @Minigame) -> bool {
        *self.current_players >= *self.max_players
    }

    fn can_start(self: @Minigame) -> bool {
        *self.current_players >= 2 && !*self.is_active
    }

    fn is_finished(self: @Minigame) -> bool {
        !*self.is_active && *self.end_time > 0
    }

    fn get_remaining_time(self: @Minigame) -> u32 {
        if *self.is_active && *self.end_time > *self.start_time {
            let current_time = starknet::get_block_timestamp();
            if current_time < *self.end_time {
                (*self.end_time - current_time).try_into().unwrap()
            } else {
                0
            }
        } else {
            0
        }
    }

    fn get_reward_multiplier(self: @Minigame) -> u32 {
        if *self.minigame_type == 0 {
            2 // Surf gives 2x rewards
        } else if *self.minigame_type == 1 {
            3 // Chaotic Kitchen gives 3x rewards
        } else if *self.minigame_type == 2 {
            4 // Sazón Duel gives 4x rewards
        } else {
            1
        }
    }

    fn get_ingredient_rewards(self: @Minigame) -> (u8, u8, u8, u8) {
        let base_amount = 2;
        let multiplier = self.get_reward_multiplier();
        let total_reward = base_amount * multiplier;

        if *self.minigame_type == 0 {
            // Surf: More rice and beans (beach theme)
            (total_reward, total_reward, 1, 0)
        } else if *self.minigame_type == 1 {
            // Chaotic Kitchen: Mix of all ingredients
            (1, 1, 1, 1)
        } else if *self.minigame_type == 2 {
            // Sazón Duel: More rare ingredients
            (1, 1, 2, 2)
        } else {
            (1, 1, 1, 1)
        }
    }
}

#[generate_trait]
pub impl MinigameAssert of AssertTrait {
    #[inline(always)]
    fn assert_exists(self: Minigame) {
        assert(self.is_non_zero(), 'Minigame: Does not exist');
    }

    #[inline(always)]
    fn assert_not_exists(self: Minigame) {
        assert(self.is_zero(), 'Minigame: Already exists');
    }
}

pub impl ZeroableMinigameTrait of Zero<Minigame> {
    #[inline(always)]
    fn zero() -> Minigame {
        Minigame {
            game_id: 0,
            minigame_id: 0,
            minigame_type: 0,
            name: 0,
            description: 0,
            is_active: false,
            current_players: 0,
            max_players: 0,
            duration_seconds: 0,
            start_time: 0,
            end_time: 0,
            winner: starknet::contract_address_const::<0>(),
            winner_score: 0,
            total_participants: 0,
            created_at: 0,
            updated_at: 0,
        }
    }

    #[inline(always)]
    fn is_zero(self: @Minigame) -> bool {
        *self.game_id == 0 && *self.minigame_id == 0
    }

    #[inline(always)]
    fn is_non_zero(self: @Minigame) -> bool {
        !self.is_zero()
    }
}

// Tests
#[cfg(test)]
mod tests {
    use super::{Minigame, ZeroableMinigameTrait, MinigameImpl, MinigameTrait, MinigameAssert};
    use full_starter_react::constants;

    #[test]
    #[available_gas(1000000)]
    fn test_surf_minigame() {
        let minigame = MinigameTrait::new_surf(1, 1, 1234567890);

        assert_eq!(minigame.game_id, 1, "Game ID should be 1");
        assert_eq!(minigame.minigame_id, 1, "Minigame ID should be 1");
        assert_eq!(minigame.minigame_type, 0, "Minigame type should be Surf");
        assert_eq!(minigame.name, 'Surf_in_Playa_Tamarindo', "Name should be Surf in Playa Tamarindo");
        assert_eq!(minigame.max_players, 4, "Max players should be 4");
        assert_eq!(minigame.duration_seconds, 120, "Duration should be 120 seconds");
        assert(!minigame.is_active, "Minigame should not be active initially");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_chaotic_kitchen_minigame() {
        let minigame = MinigameTrait::new_chaotic_kitchen(1, 2, 1234567890);

        assert_eq!(minigame.minigame_type, 1, "Minigame type should be Chaotic Kitchen");
        assert_eq!(minigame.name, 'Chaotic_Kitchen', "Name should be Chaotic Kitchen");
        assert_eq!(minigame.max_players, 6, "Max players should be 6");
        assert_eq!(minigame.duration_seconds, 180, "Duration should be 180 seconds");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_sazon_duel_minigame() {
        let minigame = MinigameTrait::new_sazon_duel(1, 3, 1234567890);

        assert_eq!(minigame.minigame_type, 2, "Minigame type should be Sazón Duel");
        assert_eq!(minigame.name, 'Sazon_Duel', "Name should be Sazón Duel");
        assert_eq!(minigame.max_players, 2, "Max players should be 2");
        assert_eq!(minigame.duration_seconds, 90, "Duration should be 90 seconds");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_start_minigame() {
        let mut minigame = MinigameTrait::new_surf(1, 1, 1234567890);

        MinigameTrait::start_minigame(ref minigame);

        assert(minigame.is_active, "Minigame should be active after starting");
        assert(minigame.start_time > 0, "Start time should be set");
        assert(minigame.end_time > minigame.start_time, "End time should be after start time");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_end_minigame() {
        let mut minigame = MinigameTrait::new_surf(1, 1, 1234567890);
        let winner = starknet::contract_address_const::<0x123>();

        MinigameTrait::end_minigame(ref minigame, winner, 150);

        assert(!minigame.is_active, "Minigame should not be active after ending");
        assert_eq!(minigame.winner, winner, "Winner should be set");
        assert_eq!(minigame.winner_score, 150, "Winner score should be set");
        assert(minigame.end_time > 0, "End time should be set");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_add_player() {
        let mut minigame = MinigameTrait::new_surf(1, 1, 1234567890);

        // Should be able to add players initially
        assert(MinigameTrait::add_player(ref minigame), "Should be able to add first player");
        assert_eq!(minigame.current_players, 1, "Current players should be 1");

        assert(MinigameTrait::add_player(ref minigame), "Should be able to add second player");
        assert_eq!(minigame.current_players, 2, "Current players should be 2");

        // Start the minigame
        MinigameTrait::start_minigame(ref minigame);

        // Should not be able to add players when active
        assert(!MinigameTrait::add_player(ref minigame), "Should not be able to add player when active");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_remove_player() {
        let mut minigame = MinigameTrait::new_surf(1, 1, 1234567890);

        // Add some players first
        MinigameTrait::add_player(ref minigame);
        MinigameTrait::add_player(ref minigame);

        // Should be able to remove players when not active
        assert(MinigameTrait::remove_player(ref minigame), "Should be able to remove player");
        assert_eq!(minigame.current_players, 1, "Current players should be 1");

        // Start the minigame
        MinigameTrait::start_minigame(ref minigame);

        // Should not be able to remove players when active
        assert(!MinigameTrait::remove_player(ref minigame), "Should not be able to remove player when active");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_is_full() {
        let mut minigame = MinigameTrait::new_surf(1, 1, 1234567890); // Max 4 players

        assert(!MinigameTrait::is_full(@minigame), "Should not be full initially");

        // Add players up to max
        MinigameTrait::add_player(ref minigame);
        MinigameTrait::add_player(ref minigame);
        MinigameTrait::add_player(ref minigame);
        MinigameTrait::add_player(ref minigame);

        assert(MinigameTrait::is_full(@minigame), "Should be full after adding max players");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_can_start() {
        let mut minigame = MinigameTrait::new_surf(1, 1, 1234567890);

        // Need at least 2 players to start
        assert(!MinigameTrait::can_start(@minigame), "Should not be able to start with 0 players");

        MinigameTrait::add_player(ref minigame);
        assert(!MinigameTrait::can_start(@minigame), "Should not be able to start with 1 player");

        MinigameTrait::add_player(ref minigame);
        assert(MinigameTrait::can_start(@minigame), "Should be able to start with 2 players");

        // Start the minigame
        MinigameTrait::start_minigame(ref minigame);
        assert(!MinigameTrait::can_start(@minigame), "Should not be able to start when already active");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_get_reward_multiplier() {
        let surf = MinigameTrait::new_surf(1, 1, 1234567890);
        let kitchen = MinigameTrait::new_chaotic_kitchen(1, 2, 1234567890);
        let duel = MinigameTrait::new_sazon_duel(1, 3, 1234567890);

        assert_eq!(MinigameTrait::get_reward_multiplier(@surf), 2, "Surf should give 2x rewards");
        assert_eq!(MinigameTrait::get_reward_multiplier(@kitchen), 3, "Chaotic Kitchen should give 3x rewards");
        assert_eq!(MinigameTrait::get_reward_multiplier(@duel), 4, "Sazón Duel should give 4x rewards");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_get_ingredient_rewards() {
        let surf = MinigameTrait::new_surf(1, 1, 1234567890);
        let kitchen = MinigameTrait::new_chaotic_kitchen(1, 2, 1234567890);
        let duel = MinigameTrait::new_sazon_duel(1, 3, 1234567890);

        let (surf_rice, surf_beans, surf_cilantro, surf_salsa) = MinigameTrait::get_ingredient_rewards(@surf);
        let (kitchen_rice, kitchen_beans, kitchen_cilantro, kitchen_salsa) = MinigameTrait::get_ingredient_rewards(@kitchen);
        let (duel_rice, duel_beans, duel_cilantro, duel_salsa) = MinigameTrait::get_ingredient_rewards(@duel);

        // Surf: More rice and beans (2x multiplier = 4 each, 1 cilantro, 0 salsa)
        assert_eq!(surf_rice, 4, "Surf should give 4 rice");
        assert_eq!(surf_beans, 4, "Surf should give 4 beans");
        assert_eq!(surf_cilantro, 1, "Surf should give 1 cilantro");
        assert_eq!(surf_salsa, 0, "Surf should give 0 salsa");

        // Kitchen: Mix of all (1 each)
        assert_eq!(kitchen_rice, 1, "Kitchen should give 1 rice");
        assert_eq!(kitchen_beans, 1, "Kitchen should give 1 beans");
        assert_eq!(kitchen_cilantro, 1, "Kitchen should give 1 cilantro");
        assert_eq!(kitchen_salsa, 1, "Kitchen should give 1 salsa");

        // Duel: More rare ingredients (1 rice/beans, 2 cilantro/salsa)
        assert_eq!(duel_rice, 1, "Duel should give 1 rice");
        assert_eq!(duel_beans, 1, "Duel should give 1 beans");
        assert_eq!(duel_cilantro, 2, "Duel should give 2 cilantro");
        assert_eq!(duel_salsa, 2, "Duel should give 2 salsa");
    }
} 