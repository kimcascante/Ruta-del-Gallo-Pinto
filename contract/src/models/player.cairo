// Starknet import
use starknet::ContractAddress;
use core::num::traits::zero::Zero;

// Constants imports
use full_starter_react::constants;

// Helpers import
use full_starter_react::helpers::timestamp::Timestamp;

// Model
#[derive(Copy, Drop, Serde, IntrospectPacked, Debug)]
#[dojo::model]
pub struct Player {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_index: u8,
    pub address: ContractAddress,
    pub name: felt252,
    pub position_x: u8,
    pub position_y: u8,
    pub health: u8,
    pub max_health: u8,
    pub energy: u8,
    pub max_energy: u8,
    pub score: u32,
    pub rice_count: u8,
    pub beans_count: u8,
    pub cilantro_count: u8,
    pub salsa_lizano_count: u8,
    pub completed_recipes: u8,
    pub is_active: bool,
    pub last_move_at: u64,
    pub created_at: u64,
    pub updated_at: u64,
}

// Traits Implementations
#[generate_trait]
pub impl PlayerImpl of PlayerTrait {
    fn new(
        game_id: u32,
        player_index: u8,
        address: ContractAddress,
        name: felt252,
        position_x: u8,
        position_y: u8,
        created_at: u64,
    ) -> Player {
        Player {
            game_id: game_id,
            player_index: player_index,
            address: address,
            name: name,
            position_x: position_x,
            position_y: position_y,
            health: 100,
            max_health: 100,
            energy: 50,
            max_energy: 50,
            score: 0,
            rice_count: 0,
            beans_count: 0,
            cilantro_count: 0,
            salsa_lizano_count: 0,
            completed_recipes: 0,
            is_active: true,
            last_move_at: created_at,
            created_at: created_at,
            updated_at: created_at,
        }
    }

    fn move_to(ref self: Player, new_x: u8, new_y: u8) {
        self.position_x = new_x;
        self.position_y = new_y;
        self.last_move_at = starknet::get_block_timestamp();
        self.updated_at = starknet::get_block_timestamp();
    }

    fn add_ingredient(ref self: Player, ingredient_type: u8, amount: u8) {
        if ingredient_type == 0 {
            self.rice_count += amount;
        } else if ingredient_type == 1 {
            self.beans_count += amount;
        } else if ingredient_type == 2 {
            self.cilantro_count += amount;
        } else if ingredient_type == 3 {
            self.salsa_lizano_count += amount;
        };
        self.updated_at = starknet::get_block_timestamp();
    }

    fn remove_ingredients(ref self: Player, rice: u8, beans: u8, cilantro: u8, salsa: u8) -> bool {
        if self.rice_count >= rice && self.beans_count >= beans && 
           self.cilantro_count >= cilantro && self.salsa_lizano_count >= salsa {
            self.rice_count -= rice;
            self.beans_count -= beans;
            self.cilantro_count -= cilantro;
            self.salsa_lizano_count -= salsa;
            self.completed_recipes += 1;
            self.score += 100; // Base recipe completion score
            self.updated_at = starknet::get_block_timestamp();
            true
        } else {
            false
        }
    }

    fn add_score(ref self: Player, points: u32) {
        self.score += points;
        self.updated_at = starknet::get_block_timestamp();
    }

    fn modify_health(ref self: Player, amount: i8) {
        let new_health = if amount > 0 {
            core::num::traits::min(self.health + amount.try_into().unwrap(), self.max_health)
        } else {
            let abs_amount: u8 = (-amount).try_into().unwrap();
            if self.health > abs_amount {
                self.health - abs_amount
            } else {
                0
            }
        };
        self.health = new_health;
        self.updated_at = starknet::get_block_timestamp();
    }

    fn modify_energy(ref self: Player, amount: i8) {
        let new_energy = if amount > 0 {
            core::num::traits::min(self.energy + amount.try_into().unwrap(), self.max_energy)
        } else {
            let abs_amount: u8 = (-amount).try_into().unwrap();
            if self.energy > abs_amount {
                self.energy - abs_amount
            } else {
                0
            }
        };
        self.energy = new_energy;
        self.updated_at = starknet::get_block_timestamp();
    }

    fn get_total_ingredients(self: @Player) -> u8 {
        *self.rice_count + *self.beans_count + *self.cilantro_count + *self.salsa_lizano_count
    }

    fn can_craft_gallo_pinto(self: @Player) -> bool {
        *self.rice_count >= 2 && *self.beans_count >= 2 && *self.cilantro_count >= 1
    }

    fn can_craft_casado(self: @Player) -> bool {
        *self.rice_count >= 1 && *self.beans_count >= 1 && *self.salsa_lizano_count >= 1
    }

    fn is_alive(self: @Player) -> bool {
        *self.health > 0
    }
}

#[generate_trait]
pub impl PlayerAssert of AssertTrait {
    #[inline(always)]
    fn assert_exists(self: Player) {
        assert(self.is_non_zero(), 'Player: Does not exist');
    }

    #[inline(always)]
    fn assert_not_exists(self: Player) {
        assert(self.is_zero(), 'Player: Already exists');
    }
}

pub impl ZeroablePlayerTrait of Zero<Player> {
    #[inline(always)]
    fn zero() -> Player {
        Player {
            game_id: 0,
            player_index: 0,
            address: starknet::contract_address_const::<0>(),
            name: 0,
            position_x: 0,
            position_y: 0,
            health: 0,
            max_health: 0,
            energy: 0,
            max_energy: 0,
            score: 0,
            rice_count: 0,
            beans_count: 0,
            cilantro_count: 0,
            salsa_lizano_count: 0,
            completed_recipes: 0,
            is_active: false,
            last_move_at: 0,
            created_at: 0,
            updated_at: 0,
        }
    }

    #[inline(always)]
    fn is_zero(self: @Player) -> bool {
        *self.game_id == 0 && *self.player_index == 0
    }

    #[inline(always)]
    fn is_non_zero(self: @Player) -> bool {
        !self.is_zero()
    }
}

// Tests
#[cfg(test)]
mod tests {
    use super::{Player, ZeroablePlayerTrait, PlayerImpl, PlayerTrait, PlayerAssert};
    use full_starter_react::constants;

    #[test]
    #[available_gas(1000000)]
    fn test_player_new() {
        let player = PlayerTrait::new(
            1,    // game_id
            0,    // player_index
            starknet::contract_address_const::<0>(), // address
            'Chef_Perro', // name
            5,    // position_x
            5,    // position_y
            1234567890, // created_at
        );

        assert_eq!(player.game_id, 1, "Game ID should be 1");
        assert_eq!(player.player_index, 0, "Player index should be 0");
        assert_eq!(player.position_x, 5, "Position X should be 5");
        assert_eq!(player.position_y, 5, "Position Y should be 5");
        assert_eq!(player.health, 100, "Health should start at 100");
        assert_eq!(player.energy, 50, "Energy should start at 50");
        assert_eq!(player.score, 0, "Score should start at 0");
        assert(player.is_active, "Player should be active");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_move_to() {
        let mut player = PlayerTrait::new(
            1,    // game_id
            0,    // player_index
            starknet::contract_address_const::<0>(), // address
            'Chef_Perro', // name
            5,    // position_x
            5,    // position_y
            1234567890, // created_at
        );

        PlayerTrait::move_to(ref player, 7, 8);
        assert_eq!(player.position_x, 7, "Position X should be updated to 7");
        assert_eq!(player.position_y, 8, "Position Y should be updated to 8");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_add_ingredient() {
        let mut player = PlayerTrait::new(
            1,    // game_id
            0,    // player_index
            starknet::contract_address_const::<0>(), // address
            'Chef_Perro', // name
            5,    // position_x
            5,    // position_y
            1234567890, // created_at
        );

        PlayerTrait::add_ingredient(ref player, 0, 3); // Add 3 rice
        assert_eq!(player.rice_count, 3, "Rice count should be 3");

        PlayerTrait::add_ingredient(ref player, 1, 2); // Add 2 beans
        assert_eq!(player.beans_count, 2, "Beans count should be 2");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_remove_ingredients() {
        let mut player = PlayerTrait::new(
            1,    // game_id
            0,    // player_index
            starknet::contract_address_const::<0>(), // address
            'Chef_Perro', // name
            5,    // position_x
            5,    // position_y
            1234567890, // created_at
        );

        // Add ingredients first
        PlayerTrait::add_ingredient(ref player, 0, 5); // 5 rice
        PlayerTrait::add_ingredient(ref player, 1, 5); // 5 beans
        PlayerTrait::add_ingredient(ref player, 2, 3); // 3 cilantro

        // Try to craft gallo pinto (2 rice, 2 beans, 1 cilantro)
        let success = PlayerTrait::remove_ingredients(ref player, 2, 2, 1, 0);
        assert(success, "Should be able to craft gallo pinto");
        assert_eq!(player.rice_count, 3, "Rice should be reduced to 3");
        assert_eq!(player.beans_count, 3, "Beans should be reduced to 3");
        assert_eq!(player.cilantro_count, 2, "Cilantro should be reduced to 2");
        assert_eq!(player.completed_recipes, 1, "Completed recipes should be 1");
        assert_eq!(player.score, 100, "Score should be increased by 100");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_can_craft_gallo_pinto() {
        let mut player = PlayerTrait::new(
            1,    // game_id
            0,    // player_index
            starknet::contract_address_const::<0>(), // address
            'Chef_Perro', // name
            5,    // position_x
            5,    // position_y
            1234567890, // created_at
        );

        // Initially should not be able to craft
        assert(!PlayerTrait::can_craft_gallo_pinto(@player), "Should not be able to craft initially");

        // Add required ingredients
        PlayerTrait::add_ingredient(ref player, 0, 2); // 2 rice
        PlayerTrait::add_ingredient(ref player, 1, 2); // 2 beans
        PlayerTrait::add_ingredient(ref player, 2, 1); // 1 cilantro

        // Now should be able to craft
        assert(PlayerTrait::can_craft_gallo_pinto(@player), "Should be able to craft gallo pinto");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_modify_health() {
        let mut player = PlayerTrait::new(
            1,    // game_id
            0,    // player_index
            starknet::contract_address_const::<0>(), // address
            'Chef_Perro', // name
            5,    // position_x
            5,    // position_y
            1234567890, // created_at
        );

        // Take damage
        PlayerTrait::modify_health(ref player, -20);
        assert_eq!(player.health, 80, "Health should be reduced to 80");

        // Heal
        PlayerTrait::modify_health(ref player, 10);
        assert_eq!(player.health, 90, "Health should be increased to 90");

        // Heal beyond max
        PlayerTrait::modify_health(ref player, 20);
        assert_eq!(player.health, 100, "Health should be capped at 100");
    }
}