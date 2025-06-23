// Starknet import
use starknet::ContractAddress;
use core::num::traits::zero::Zero;

// Constants imports
use full_starter_react::constants;

// Model
#[derive(Copy, Drop, Serde, IntrospectPacked, Debug)]
#[dojo::model]
pub struct Ingredient {
    #[key]
    pub game_id: u32,
    #[key]
    pub ingredient_id: u32,
    pub ingredient_type: u8, // 0=Rice, 1=Beans, 2=Cilantro, 3=Salsa Lizano
    pub position_x: u8,
    pub position_y: u8,
    pub is_collected: bool,
    pub collected_by: ContractAddress,
    pub collected_at: u64,
    pub spawn_turn: u32,
    pub created_at: u64,
    pub updated_at: u64,
}

// Traits Implementations
#[generate_trait]
pub impl IngredientImpl of IngredientTrait {
    fn new(
        game_id: u32,
        ingredient_id: u32,
        ingredient_type: u8,
        position_x: u8,
        position_y: u8,
        spawn_turn: u32,
        created_at: u64,
    ) -> Ingredient {
        Ingredient {
            game_id: game_id,
            ingredient_id: ingredient_id,
            ingredient_type: ingredient_type,
            position_x: position_x,
            position_y: position_y,
            is_collected: false,
            collected_by: starknet::contract_address_const::<0>(),
            collected_at: 0,
            spawn_turn: spawn_turn,
            created_at: created_at,
            updated_at: created_at,
        }
    }

    fn collect(ref self: Ingredient, collector: ContractAddress) {
        self.is_collected = true;
        self.collected_by = collector;
        self.collected_at = starknet::get_block_timestamp();
        self.updated_at = starknet::get_block_timestamp();
    }

    fn respawn(ref self: Ingredient, new_x: u8, new_y: u8, new_turn: u32) {
        self.position_x = new_x;
        self.position_y = new_y;
        self.is_collected = false;
        self.collected_by = starknet::contract_address_const::<0>();
        self.collected_at = 0;
        self.spawn_turn = new_turn;
        self.updated_at = starknet::get_block_timestamp();
    }

    fn get_ingredient_name(self: @Ingredient) -> felt252 {
        if *self.ingredient_type == 0 {
            'Rice'
        } else if *self.ingredient_type == 1 {
            'Beans'
        } else if *self.ingredient_type == 2 {
            'Cilantro'
        } else if *self.ingredient_type == 3 {
            'Salsa_Lizano'
        } else {
            'Unknown'
        }
    }

    fn get_ingredient_value(self: @Ingredient) -> u8 {
        if *self.ingredient_type == 0 {
            1 // Rice
        } else if *self.ingredient_type == 1 {
            1 // Beans
        } else if *self.ingredient_type == 2 {
            2 // Cilantro (rarer)
        } else if *self.ingredient_type == 3 {
            3 // Salsa Lizano (rarest)
        } else {
            0
        }
    }

    fn is_at_position(self: @Ingredient, x: u8, y: u8) -> bool {
        *self.position_x == x && *self.position_y == y
    }

    fn can_be_collected(self: @Ingredient) -> bool {
        !*self.is_collected
    }
}

#[generate_trait]
pub impl IngredientAssert of AssertTrait {
    #[inline(always)]
    fn assert_exists(self: Ingredient) {
        assert(self.is_non_zero(), 'Ingredient: Does not exist');
    }

    #[inline(always)]
    fn assert_not_exists(self: Ingredient) {
        assert(self.is_zero(), 'Ingredient: Already exists');
    }
}

pub impl ZeroableIngredientTrait of Zero<Ingredient> {
    #[inline(always)]
    fn zero() -> Ingredient {
        Ingredient {
            game_id: 0,
            ingredient_id: 0,
            ingredient_type: 0,
            position_x: 0,
            position_y: 0,
            is_collected: false,
            collected_by: starknet::contract_address_const::<0>(),
            collected_at: 0,
            spawn_turn: 0,
            created_at: 0,
            updated_at: 0,
        }
    }

    #[inline(always)]
    fn is_zero(self: @Ingredient) -> bool {
        *self.game_id == 0 && *self.ingredient_id == 0
    }

    #[inline(always)]
    fn is_non_zero(self: @Ingredient) -> bool {
        !self.is_zero()
    }
}

// Tests
#[cfg(test)]
mod tests {
    use super::{Ingredient, ZeroableIngredientTrait, IngredientImpl, IngredientTrait, IngredientAssert};
    use full_starter_react::constants;

    #[test]
    #[available_gas(1000000)]
    fn test_ingredient_new() {
        let ingredient = IngredientTrait::new(
            1,    // game_id
            1,    // ingredient_id
            0,    // ingredient_type (Rice)
            5,    // position_x
            7,    // position_y
            1,    // spawn_turn
            1234567890, // created_at
        );

        assert_eq!(ingredient.game_id, 1, "Game ID should be 1");
        assert_eq!(ingredient.ingredient_id, 1, "Ingredient ID should be 1");
        assert_eq!(ingredient.ingredient_type, 0, "Ingredient type should be Rice");
        assert_eq!(ingredient.position_x, 5, "Position X should be 5");
        assert_eq!(ingredient.position_y, 7, "Position Y should be 7");
        assert(!ingredient.is_collected, "Ingredient should not be collected initially");
        assert_eq!(ingredient.spawn_turn, 1, "Spawn turn should be 1");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_collect() {
        let mut ingredient = IngredientTrait::new(
            1,    // game_id
            1,    // ingredient_id
            1,    // ingredient_type (Beans)
            3,    // position_x
            4,    // position_y
            1,    // spawn_turn
            1234567890, // created_at
        );

        let collector = starknet::contract_address_const::<0x123>();
        IngredientTrait::collect(ref ingredient, collector);

        assert(ingredient.is_collected, "Ingredient should be collected");
        assert_eq!(ingredient.collected_by, collector, "Collector should be set");
        assert(ingredient.collected_at > 0, "Collection time should be set");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_respawn() {
        let mut ingredient = IngredientTrait::new(
            1,    // game_id
            1,    // ingredient_id
            2,    // ingredient_type (Cilantro)
            1,    // position_x
            1,    // position_y
            1,    // spawn_turn
            1234567890, // created_at
        );

        // Collect first
        let collector = starknet::contract_address_const::<0x123>();
        IngredientTrait::collect(ref ingredient, collector);

        // Then respawn
        IngredientTrait::respawn(ref ingredient, 8, 9, 5);

        assert(!ingredient.is_collected, "Ingredient should not be collected after respawn");
        assert_eq!(ingredient.position_x, 8, "Position X should be updated to 8");
        assert_eq!(ingredient.position_y, 9, "Position Y should be updated to 9");
        assert_eq!(ingredient.spawn_turn, 5, "Spawn turn should be updated to 5");
        assert_eq!(ingredient.collected_by, starknet::contract_address_const::<0>(), "Collector should be reset");
        assert_eq!(ingredient.collected_at, 0, "Collection time should be reset");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_get_ingredient_name() {
        let rice = IngredientTrait::new(
            1, 1, 0, 1, 1, 1, 1234567890, // Rice
        );
        let beans = IngredientTrait::new(
            1, 2, 1, 1, 1, 1, 1234567890, // Beans
        );
        let cilantro = IngredientTrait::new(
            1, 3, 2, 1, 1, 1, 1234567890, // Cilantro
        );
        let salsa = IngredientTrait::new(
            1, 4, 3, 1, 1, 1, 1234567890, // Salsa Lizano
        );

        assert_eq!(IngredientTrait::get_ingredient_name(@rice), 'Rice', "Rice name should be correct");
        assert_eq!(IngredientTrait::get_ingredient_name(@beans), 'Beans', "Beans name should be correct");
        assert_eq!(IngredientTrait::get_ingredient_name(@cilantro), 'Cilantro', "Cilantro name should be correct");
        assert_eq!(IngredientTrait::get_ingredient_name(@salsa), 'Salsa_Lizano', "Salsa name should be correct");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_get_ingredient_value() {
        let rice = IngredientTrait::new(
            1, 1, 0, 1, 1, 1, 1234567890, // Rice
        );
        let beans = IngredientTrait::new(
            1, 2, 1, 1, 1, 1, 1234567890, // Beans
        );
        let cilantro = IngredientTrait::new(
            1, 3, 2, 1, 1, 1, 1234567890, // Cilantro
        );
        let salsa = IngredientTrait::new(
            1, 4, 3, 1, 1, 1, 1234567890, // Salsa Lizano
        );

        assert_eq!(IngredientTrait::get_ingredient_value(@rice), 1, "Rice value should be 1");
        assert_eq!(IngredientTrait::get_ingredient_value(@beans), 1, "Beans value should be 1");
        assert_eq!(IngredientTrait::get_ingredient_value(@cilantro), 2, "Cilantro value should be 2");
        assert_eq!(IngredientTrait::get_ingredient_value(@salsa), 3, "Salsa value should be 3");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_is_at_position() {
        let ingredient = IngredientTrait::new(
            1, 1, 0, 5, 7, 1, 1234567890,
        );

        assert(IngredientTrait::is_at_position(@ingredient, 5, 7), "Should be at position (5,7)");
        assert(!IngredientTrait::is_at_position(@ingredient, 5, 8), "Should not be at position (5,8)");
        assert(!IngredientTrait::is_at_position(@ingredient, 6, 7), "Should not be at position (6,7)");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_can_be_collected() {
        let mut ingredient = IngredientTrait::new(
            1, 1, 0, 1, 1, 1, 1234567890,
        );

        // Initially can be collected
        assert(IngredientTrait::can_be_collected(@ingredient), "Should be collectible initially");

        // After collection, cannot be collected
        let collector = starknet::contract_address_const::<0x123>();
        IngredientTrait::collect(ref ingredient, collector);
        assert(!IngredientTrait::can_be_collected(@ingredient), "Should not be collectible after collection");
    }
} 