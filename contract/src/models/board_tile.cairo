// Starknet import
use starknet::ContractAddress;
use core::num::traits::zero::Zero;

// Constants imports
use full_starter_react::constants;

// Model
#[derive(Copy, Drop, Serde, IntrospectPacked, Debug)]
#[dojo::model]
pub struct BoardTile {
    #[key]
    pub game_id: u32,
    #[key]
    pub position_x: u8,
    #[key]
    pub position_y: u8,
    pub tile_type: u8, // 0=Regular, 1=Ingredient, 2=Minigame, 3=Special, 4=Obstacle
    pub tile_subtype: u8, // For ingredient tiles: 0=Rice, 1=Beans, 2=Cilantro, 3=Salsa
                         // For minigame tiles: 0=Surf, 1=Chaotic Kitchen, 2=Sazón Duel
                         // For special tiles: 0=Health, 1=Energy, 2=Score, 3=Teleport
    pub is_passable: bool,
    pub movement_cost: u8,
    pub has_ingredient: bool,
    pub ingredient_id: u32,
    pub has_minigame: bool,
    pub minigame_id: u32,
    pub special_effect: u8, // 0=None, 1=Heal, 2=Energy, 3=Score, 4=Teleport
    pub effect_value: u32,
    pub is_activated: bool,
    pub activated_by: ContractAddress,
    pub activated_at: u64,
    pub created_at: u64,
    pub updated_at: u64,
}

// Traits Implementations
#[generate_trait]
pub impl BoardTileImpl of BoardTileTrait {
    fn new_regular(
        game_id: u32,
        position_x: u8,
        position_y: u8,
        created_at: u64,
    ) -> BoardTile {
        BoardTile {
            game_id: game_id,
            position_x: position_x,
            position_y: position_y,
            tile_type: 0,
            tile_subtype: 0,
            is_passable: true,
            movement_cost: 1,
            has_ingredient: false,
            ingredient_id: 0,
            has_minigame: false,
            minigame_id: 0,
            special_effect: 0,
            effect_value: 0,
            is_activated: false,
            activated_by: starknet::contract_address_const::<0>(),
            activated_at: 0,
            created_at: created_at,
            updated_at: created_at,
        }
    }

    fn new_ingredient_tile(
        game_id: u32,
        position_x: u8,
        position_y: u8,
        ingredient_type: u8,
        ingredient_id: u32,
        created_at: u64,
    ) -> BoardTile {
        BoardTile {
            game_id: game_id,
            position_x: position_x,
            position_y: position_y,
            tile_type: 1,
            tile_subtype: ingredient_type,
            is_passable: true,
            movement_cost: 1,
            has_ingredient: true,
            ingredient_id: ingredient_id,
            has_minigame: false,
            minigame_id: 0,
            special_effect: 0,
            effect_value: 0,
            is_activated: false,
            activated_by: starknet::contract_address_const::<0>(),
            activated_at: 0,
            created_at: created_at,
            updated_at: created_at,
        }
    }

    fn new_minigame_tile(
        game_id: u32,
        position_x: u8,
        position_y: u8,
        minigame_type: u8,
        minigame_id: u32,
        created_at: u64,
    ) -> BoardTile {
        BoardTile {
            game_id: game_id,
            position_x: position_x,
            position_y: position_y,
            tile_type: 2,
            tile_subtype: minigame_type,
            is_passable: true,
            movement_cost: 2, // Higher cost for minigame tiles
            has_ingredient: false,
            ingredient_id: 0,
            has_minigame: true,
            minigame_id: minigame_id,
            special_effect: 0,
            effect_value: 0,
            is_activated: false,
            activated_by: starknet::contract_address_const::<0>(),
            activated_at: 0,
            created_at: created_at,
            updated_at: created_at,
        }
    }

    fn new_special_tile(
        game_id: u32,
        position_x: u8,
        position_y: u8,
        special_effect: u8,
        effect_value: u32,
        created_at: u64,
    ) -> BoardTile {
        BoardTile {
            game_id: game_id,
            position_x: position_x,
            position_y: position_y,
            tile_type: 3,
            tile_subtype: special_effect,
            is_passable: true,
            movement_cost: 1,
            has_ingredient: false,
            ingredient_id: 0,
            has_minigame: false,
            minigame_id: 0,
            special_effect: special_effect,
            effect_value: effect_value,
            is_activated: false,
            activated_by: starknet::contract_address_const::<0>(),
            activated_at: 0,
            created_at: created_at,
            updated_at: created_at,
        }
    }

    fn new_obstacle_tile(
        game_id: u32,
        position_x: u8,
        position_y: u8,
        created_at: u64,
    ) -> BoardTile {
        BoardTile {
            game_id: game_id,
            position_x: position_x,
            position_y: position_y,
            tile_type: 4,
            tile_subtype: 0,
            is_passable: false,
            movement_cost: 0,
            has_ingredient: false,
            ingredient_id: 0,
            has_minigame: false,
            minigame_id: 0,
            special_effect: 0,
            effect_value: 0,
            is_activated: false,
            activated_by: starknet::contract_address_const::<0>(),
            activated_at: 0,
            created_at: created_at,
            updated_at: created_at,
        }
    }

    fn activate_tile(ref self: BoardTile, player: ContractAddress) {
        self.is_activated = true;
        self.activated_by = player;
        self.activated_at = starknet::get_block_timestamp();
        self.updated_at = starknet::get_block_timestamp();
    }

    fn deactivate_tile(ref self: BoardTile) {
        self.is_activated = false;
        self.activated_by = starknet::contract_address_const::<0>();
        self.activated_at = 0;
        self.updated_at = starknet::get_block_timestamp();
    }

    fn remove_ingredient(ref self: BoardTile) {
        self.has_ingredient = false;
        self.ingredient_id = 0;
        self.updated_at = starknet::get_block_timestamp();
    }

    fn add_ingredient(ref self: BoardTile, ingredient_type: u8, ingredient_id: u32) {
        self.has_ingredient = true;
        self.tile_subtype = ingredient_type;
        self.ingredient_id = ingredient_id;
        self.updated_at = starknet::get_block_timestamp();
    }

    fn get_tile_name(self: @BoardTile) -> felt252 {
        if *self.tile_type == 0 {
            'Regular_Tile'
        } else if *self.tile_type == 1 {
            'Ingredient_Tile'
        } else if *self.tile_type == 2 {
            'Minigame_Tile'
        } else if *self.tile_type == 3 {
            'Special_Tile'
        } else if *self.tile_type == 4 {
            'Obstacle_Tile'
        } else {
            'Unknown_Tile'
        }
    }

    fn get_ingredient_name(self: @BoardTile) -> felt252 {
        if *self.has_ingredient {
            if *self.tile_subtype == 0 {
                'Rice'
            } else if *self.tile_subtype == 1 {
                'Beans'
            } else if *self.tile_subtype == 2 {
                'Cilantro'
            } else if *self.tile_subtype == 3 {
                'Salsa_Lizano'
            } else {
                'Unknown_Ingredient'
            }
        } else {
            'No_Ingredient'
        }
    }

    fn get_minigame_name(self: @BoardTile) -> felt252 {
        if *self.has_minigame {
            if *self.tile_subtype == 0 {
                'Surf_in_Playa_Tamarindo'
            } else if *self.tile_subtype == 1 {
                'Chaotic_Kitchen'
            } else if *self.tile_subtype == 2 {
                'Sazon_Duel'
            } else {
                'Unknown_Minigame'
            }
        } else {
            'No_Minigame'
        }
    }

    fn get_special_effect_name(self: @BoardTile) -> felt252 {
        if *self.special_effect == 1 {
            'Health_Boost'
        } else if *self.special_effect == 2 {
            'Energy_Boost'
        } else if *self.special_effect == 3 {
            'Score_Boost'
        } else if *self.special_effect == 4 {
            'Teleport'
        } else {
            'No_Effect'
        }
    }

    fn can_player_move_to(self: @BoardTile, player_energy: u8) -> bool {
        *self.is_passable && player_energy >= *self.movement_cost
    }

    fn is_adjacent_to(self: @BoardTile, other_x: u8, other_y: u8) -> bool {
        let x_diff = if *self.position_x > other_x {
            *self.position_x - other_x
        } else {
            other_x - *self.position_x
        };
        let y_diff = if *self.position_y > other_y {
            *self.position_y - other_y
        } else {
            other_y - *self.position_y
        };
        (x_diff <= 1 && y_diff == 0) || (y_diff <= 1 && x_diff == 0)
    }
}

#[generate_trait]
pub impl BoardTileAssert of AssertTrait {
    #[inline(always)]
    fn assert_exists(self: BoardTile) {
        assert(self.is_non_zero(), 'BoardTile: Does not exist');
    }

    #[inline(always)]
    fn assert_not_exists(self: BoardTile) {
        assert(self.is_zero(), 'BoardTile: Already exists');
    }
}

pub impl ZeroableBoardTileTrait of Zero<BoardTile> {
    #[inline(always)]
    fn zero() -> BoardTile {
        BoardTile {
            game_id: 0,
            position_x: 0,
            position_y: 0,
            tile_type: 0,
            tile_subtype: 0,
            is_passable: false,
            movement_cost: 0,
            has_ingredient: false,
            ingredient_id: 0,
            has_minigame: false,
            minigame_id: 0,
            special_effect: 0,
            effect_value: 0,
            is_activated: false,
            activated_by: starknet::contract_address_const::<0>(),
            activated_at: 0,
            created_at: 0,
            updated_at: 0,
        }
    }

    #[inline(always)]
    fn is_zero(self: @BoardTile) -> bool {
        *self.game_id == 0 && *self.position_x == 0 && *self.position_y == 0
    }

    #[inline(always)]
    fn is_non_zero(self: @BoardTile) -> bool {
        !self.is_zero()
    }
}

// Tests
#[cfg(test)]
mod tests {
    use super::{BoardTile, ZeroableBoardTileTrait, BoardTileImpl, BoardTileTrait, BoardTileAssert};
    use full_starter_react::constants;

    #[test]
    #[available_gas(1000000)]
    fn test_regular_tile() {
        let tile = BoardTileTrait::new_regular(1, 5, 7, 1234567890);

        assert_eq!(tile.game_id, 1, "Game ID should be 1");
        assert_eq!(tile.position_x, 5, "Position X should be 5");
        assert_eq!(tile.position_y, 7, "Position Y should be 7");
        assert_eq!(tile.tile_type, 0, "Tile type should be regular");
        assert(tile.is_passable, "Regular tile should be passable");
        assert_eq!(tile.movement_cost, 1, "Movement cost should be 1");
        assert(!tile.has_ingredient, "Regular tile should not have ingredient");
        assert(!tile.has_minigame, "Regular tile should not have minigame");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_ingredient_tile() {
        let tile = BoardTileTrait::new_ingredient_tile(1, 3, 4, 2, 5, 1234567890); // Cilantro

        assert_eq!(tile.tile_type, 1, "Tile type should be ingredient");
        assert_eq!(tile.tile_subtype, 2, "Ingredient type should be cilantro");
        assert_eq!(tile.ingredient_id, 5, "Ingredient ID should be 5");
        assert(tile.has_ingredient, "Ingredient tile should have ingredient");
        assert(!tile.has_minigame, "Ingredient tile should not have minigame");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_minigame_tile() {
        let tile = BoardTileTrait::new_minigame_tile(1, 8, 9, 1, 3, 1234567890); // Chaotic Kitchen

        assert_eq!(tile.tile_type, 2, "Tile type should be minigame");
        assert_eq!(tile.tile_subtype, 1, "Minigame type should be Chaotic Kitchen");
        assert_eq!(tile.minigame_id, 3, "Minigame ID should be 3");
        assert_eq!(tile.movement_cost, 2, "Minigame tile should have higher movement cost");
        assert(tile.has_minigame, "Minigame tile should have minigame");
        assert(!tile.has_ingredient, "Minigame tile should not have ingredient");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_special_tile() {
        let tile = BoardTileTrait::new_special_tile(1, 2, 3, 1, 50, 1234567890); // Health boost

        assert_eq!(tile.tile_type, 3, "Tile type should be special");
        assert_eq!(tile.special_effect, 1, "Special effect should be health boost");
        assert_eq!(tile.effect_value, 50, "Effect value should be 50");
        assert(!tile.has_ingredient, "Special tile should not have ingredient");
        assert(!tile.has_minigame, "Special tile should not have minigame");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_obstacle_tile() {
        let tile = BoardTileTrait::new_obstacle_tile(1, 6, 6, 1234567890);

        assert_eq!(tile.tile_type, 4, "Tile type should be obstacle");
        assert(!tile.is_passable, "Obstacle tile should not be passable");
        assert_eq!(tile.movement_cost, 0, "Obstacle tile should have 0 movement cost");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_activate_tile() {
        let mut tile = BoardTileTrait::new_regular(1, 1, 1, 1234567890);
        let player = starknet::contract_address_const::<0x123>();

        BoardTileTrait::activate_tile(ref tile, player);

        assert(tile.is_activated, "Tile should be activated");
        assert_eq!(tile.activated_by, player, "Activated by should be set");
        assert(tile.activated_at > 0, "Activated at should be set");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_deactivate_tile() {
        let mut tile = BoardTileTrait::new_regular(1, 1, 1, 1234567890);
        let player = starknet::contract_address_const::<0x123>();

        // Activate first
        BoardTileTrait::activate_tile(ref tile, player);
        assert(tile.is_activated, "Tile should be activated");

        // Then deactivate
        BoardTileTrait::deactivate_tile(ref tile);
        assert(!tile.is_activated, "Tile should be deactivated");
        assert_eq!(tile.activated_by, starknet::contract_address_const::<0>(), "Activated by should be reset");
        assert_eq!(tile.activated_at, 0, "Activated at should be reset");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_remove_ingredient() {
        let mut tile = BoardTileTrait::new_ingredient_tile(1, 1, 1, 0, 1, 1234567890);

        assert(tile.has_ingredient, "Tile should have ingredient initially");

        BoardTileTrait::remove_ingredient(ref tile);

        assert(!tile.has_ingredient, "Tile should not have ingredient after removal");
        assert_eq!(tile.ingredient_id, 0, "Ingredient ID should be reset");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_add_ingredient() {
        let mut tile = BoardTileTrait::new_regular(1, 1, 1, 1234567890);

        assert(!tile.has_ingredient, "Tile should not have ingredient initially");

        BoardTileTrait::add_ingredient(ref tile, 3, 7); // Add Salsa Lizano

        assert(tile.has_ingredient, "Tile should have ingredient after adding");
        assert_eq!(tile.tile_subtype, 3, "Tile subtype should be Salsa Lizano");
        assert_eq!(tile.ingredient_id, 7, "Ingredient ID should be 7");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_get_tile_name() {
        let regular = BoardTileTrait::new_regular(1, 1, 1, 1234567890);
        let ingredient = BoardTileTrait::new_ingredient_tile(1, 1, 1, 0, 1, 1234567890);
        let minigame = BoardTileTrait::new_minigame_tile(1, 1, 1, 0, 1, 1234567890);
        let special = BoardTileTrait::new_special_tile(1, 1, 1, 1, 50, 1234567890);
        let obstacle = BoardTileTrait::new_obstacle_tile(1, 1, 1, 1234567890);

        assert_eq!(BoardTileTrait::get_tile_name(@regular), 'Regular_Tile', "Regular tile name should be correct");
        assert_eq!(BoardTileTrait::get_tile_name(@ingredient), 'Ingredient_Tile', "Ingredient tile name should be correct");
        assert_eq!(BoardTileTrait::get_tile_name(@minigame), 'Minigame_Tile', "Minigame tile name should be correct");
        assert_eq!(BoardTileTrait::get_tile_name(@special), 'Special_Tile', "Special tile name should be correct");
        assert_eq!(BoardTileTrait::get_tile_name(@obstacle), 'Obstacle_Tile', "Obstacle tile name should be correct");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_get_ingredient_name() {
        let rice_tile = BoardTileTrait::new_ingredient_tile(1, 1, 1, 0, 1, 1234567890);
        let beans_tile = BoardTileTrait::new_ingredient_tile(1, 1, 1, 1, 2, 1234567890);
        let cilantro_tile = BoardTileTrait::new_ingredient_tile(1, 1, 1, 2, 3, 1234567890);
        let salsa_tile = BoardTileTrait::new_ingredient_tile(1, 1, 1, 3, 4, 1234567890);
        let regular_tile = BoardTileTrait::new_regular(1, 1, 1, 1234567890);

        assert_eq!(BoardTileTrait::get_ingredient_name(@rice_tile), 'Rice', "Rice tile should return Rice");
        assert_eq!(BoardTileTrait::get_ingredient_name(@beans_tile), 'Beans', "Beans tile should return Beans");
        assert_eq!(BoardTileTrait::get_ingredient_name(@cilantro_tile), 'Cilantro', "Cilantro tile should return Cilantro");
        assert_eq!(BoardTileTrait::get_ingredient_name(@salsa_tile), 'Salsa_Lizano', "Salsa tile should return Salsa Lizano");
        assert_eq!(BoardTileTrait::get_ingredient_name(@regular_tile), 'No_Ingredient', "Regular tile should return No Ingredient");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_can_player_move_to() {
        let regular_tile = BoardTileTrait::new_regular(1, 1, 1, 1234567890);
        let minigame_tile = BoardTileTrait::new_minigame_tile(1, 1, 1, 0, 1, 1234567890);
        let obstacle_tile = BoardTileTrait::new_obstacle_tile(1, 1, 1, 1234567890);

        // Player with enough energy
        assert(BoardTileTrait::can_player_move_to(@regular_tile, 5), "Should be able to move to regular tile with enough energy");
        assert(BoardTileTrait::can_player_move_to(@minigame_tile, 5), "Should be able to move to minigame tile with enough energy");

        // Player with insufficient energy
        assert(!BoardTileTrait::can_player_move_to(@minigame_tile, 1), "Should not be able to move to minigame tile with insufficient energy");

        // Obstacle tile
        assert(!BoardTileTrait::can_player_move_to(@obstacle_tile, 10), "Should not be able to move to obstacle tile");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_is_adjacent_to() {
        let tile = BoardTileTrait::new_regular(1, 5, 5, 1234567890);

        // Adjacent tiles
        assert(BoardTileTrait::is_adjacent_to(@tile, 5, 4), "Should be adjacent to tile above");
        assert(BoardTileTrait::is_adjacent_to(@tile, 5, 6), "Should be adjacent to tile below");
        assert(BoardTileTrait::is_adjacent_to(@tile, 4, 5), "Should be adjacent to tile left");
        assert(BoardTileTrait::is_adjacent_to(@tile, 6, 5), "Should be adjacent to tile right");

        // Non-adjacent tiles
        assert(!BoardTileTrait::is_adjacent_to(@tile, 5, 7), "Should not be adjacent to tile 2 spaces away");
        assert(!BoardTileTrait::is_adjacent_to(@tile, 7, 5), "Should not be adjacent to tile 2 spaces away");
        assert(!BoardTileTrait::is_adjacent_to(@tile, 6, 6), "Should not be adjacent to diagonal tile");
    }
} 