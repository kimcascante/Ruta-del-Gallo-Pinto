// Starknet import
use starknet::ContractAddress;
use core::num::traits::zero::Zero;

// Constants imports
use full_starter_react::constants;

// Model
#[derive(Copy, Drop, Serde, IntrospectPacked, Debug)]
#[dojo::model]
pub struct Recipe {
    #[key]
    pub recipe_id: u32,
    pub name: felt252,
    pub description: felt252,
    pub rice_required: u8,
    pub beans_required: u8,
    pub cilantro_required: u8,
    pub salsa_required: u8,
    pub base_score: u32,
    pub health_bonus: u8,
    pub energy_bonus: u8,
    pub is_active: bool,
    pub created_at: u64,
    pub updated_at: u64,
}

// Traits Implementations
#[generate_trait]
pub impl RecipeImpl of RecipeTrait {
    fn new_gallo_pinto(recipe_id: u32, created_at: u64) -> Recipe {
        Recipe {
            recipe_id: recipe_id,
            name: 'Gallo_Pinto',
            description: 'Traditional_Costa_Rican_rice_and_beans',
            rice_required: 2,
            beans_required: 2,
            cilantro_required: 1,
            salsa_required: 0,
            base_score: 100,
            health_bonus: 20,
            energy_bonus: 15,
            is_active: true,
            created_at: created_at,
            updated_at: created_at,
        }
    }

    fn new_casado(recipe_id: u32, created_at: u64) -> Recipe {
        Recipe {
            recipe_id: recipe_id,
            name: 'Casado',
            description: 'Complete_meal_with_rice_beans_and_salsa',
            rice_required: 1,
            beans_required: 1,
            cilantro_required: 0,
            salsa_required: 1,
            base_score: 150,
            health_bonus: 30,
            energy_bonus: 25,
            is_active: true,
            created_at: created_at,
            updated_at: created_at,
        }
    }

    fn new_custom(
        recipe_id: u32,
        name: felt252,
        description: felt252,
        rice_required: u8,
        beans_required: u8,
        cilantro_required: u8,
        salsa_required: u8,
        base_score: u32,
        health_bonus: u8,
        energy_bonus: u8,
        created_at: u64,
    ) -> Recipe {
        Recipe {
            recipe_id: recipe_id,
            name: name,
            description: description,
            rice_required: rice_required,
            beans_required: beans_required,
            cilantro_required: cilantro_required,
            salsa_required: salsa_required,
            base_score: base_score,
            health_bonus: health_bonus,
            energy_bonus: energy_bonus,
            is_active: true,
            created_at: created_at,
            updated_at: created_at,
        }
    }

    fn can_craft_with_ingredients(self: @Recipe, rice: u8, beans: u8, cilantro: u8, salsa: u8) -> bool {
        rice >= *self.rice_required && 
        beans >= *self.beans_required && 
        cilantro >= *self.cilantro_required && 
        salsa >= *self.salsa_required
    }

    fn get_total_ingredients_required(self: @Recipe) -> u8 {
        *self.rice_required + *self.beans_required + *self.cilantro_required + *self.salsa_required
    }

    fn get_difficulty_level(self: @Recipe) -> u8 {
        let total_ingredients = self.get_total_ingredients_required();
        if total_ingredients <= 3 {
            1 // Easy
        } else if total_ingredients <= 5 {
            2 // Medium
        } else {
            3 // Hard
        }
    }

    fn get_bonus_multiplier(self: @Recipe) -> u32 {
        let difficulty = self.get_difficulty_level();
        if difficulty == 1 {
            1 // Easy recipes get no bonus
        } else if difficulty == 2 {
            2 // Medium recipes get 2x bonus
        } else {
            3 // Hard recipes get 3x bonus
        }
    }

    fn calculate_final_score(self: @Recipe) -> u32 {
        let base_score = *self.base_score;
        let multiplier = self.get_bonus_multiplier();
        base_score * multiplier
    }

    fn toggle_active(ref self: Recipe) {
        self.is_active = !self.is_active;
        self.updated_at = starknet::get_block_timestamp();
    }

    fn update_requirements(
        ref self: Recipe,
        rice: u8,
        beans: u8,
        cilantro: u8,
        salsa: u8,
        base_score: u32,
        health_bonus: u8,
        energy_bonus: u8,
    ) {
        self.rice_required = rice;
        self.beans_required = beans;
        self.cilantro_required = cilantro;
        self.salsa_required = salsa;
        self.base_score = base_score;
        self.health_bonus = health_bonus;
        self.energy_bonus = energy_bonus;
        self.updated_at = starknet::get_block_timestamp();
    }
}

#[generate_trait]
pub impl RecipeAssert of AssertTrait {
    #[inline(always)]
    fn assert_exists(self: Recipe) {
        assert(self.is_non_zero(), 'Recipe: Does not exist');
    }

    #[inline(always)]
    fn assert_not_exists(self: Recipe) {
        assert(self.is_zero(), 'Recipe: Already exists');
    }
}

pub impl ZeroableRecipeTrait of Zero<Recipe> {
    #[inline(always)]
    fn zero() -> Recipe {
        Recipe {
            recipe_id: 0,
            name: 0,
            description: 0,
            rice_required: 0,
            beans_required: 0,
            cilantro_required: 0,
            salsa_required: 0,
            base_score: 0,
            health_bonus: 0,
            energy_bonus: 0,
            is_active: false,
            created_at: 0,
            updated_at: 0,
        }
    }

    #[inline(always)]
    fn is_zero(self: @Recipe) -> bool {
        *self.recipe_id == 0
    }

    #[inline(always)]
    fn is_non_zero(self: @Recipe) -> bool {
        !self.is_zero()
    }
}

// Tests
#[cfg(test)]
mod tests {
    use super::{Recipe, ZeroableRecipeTrait, RecipeImpl, RecipeTrait, RecipeAssert};
    use full_starter_react::constants;

    #[test]
    #[available_gas(1000000)]
    fn test_gallo_pinto_recipe() {
        let recipe = RecipeTrait::new_gallo_pinto(1, 1234567890);

        assert_eq!(recipe.recipe_id, 1, "Recipe ID should be 1");
        assert_eq!(recipe.name, 'Gallo_Pinto', "Name should be Gallo Pinto");
        assert_eq!(recipe.rice_required, 2, "Should require 2 rice");
        assert_eq!(recipe.beans_required, 2, "Should require 2 beans");
        assert_eq!(recipe.cilantro_required, 1, "Should require 1 cilantro");
        assert_eq!(recipe.salsa_required, 0, "Should require 0 salsa");
        assert_eq!(recipe.base_score, 100, "Base score should be 100");
        assert_eq!(recipe.health_bonus, 20, "Health bonus should be 20");
        assert_eq!(recipe.energy_bonus, 15, "Energy bonus should be 15");
        assert(recipe.is_active, "Recipe should be active");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_casado_recipe() {
        let recipe = RecipeTrait::new_casado(2, 1234567890);

        assert_eq!(recipe.recipe_id, 2, "Recipe ID should be 2");
        assert_eq!(recipe.name, 'Casado', "Name should be Casado");
        assert_eq!(recipe.rice_required, 1, "Should require 1 rice");
        assert_eq!(recipe.beans_required, 1, "Should require 1 beans");
        assert_eq!(recipe.cilantro_required, 0, "Should require 0 cilantro");
        assert_eq!(recipe.salsa_required, 1, "Should require 1 salsa");
        assert_eq!(recipe.base_score, 150, "Base score should be 150");
        assert_eq!(recipe.health_bonus, 30, "Health bonus should be 30");
        assert_eq!(recipe.energy_bonus, 25, "Energy bonus should be 25");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_can_craft_with_ingredients() {
        let gallo_pinto = RecipeTrait::new_gallo_pinto(1, 1234567890);

        // Should be able to craft with exact ingredients
        assert(RecipeTrait::can_craft_with_ingredients(@gallo_pinto, 2, 2, 1, 0), "Should craft with exact ingredients");

        // Should be able to craft with more ingredients
        assert(RecipeTrait::can_craft_with_ingredients(@gallo_pinto, 5, 3, 2, 1), "Should craft with more ingredients");

        // Should not be able to craft with insufficient ingredients
        assert(!RecipeTrait::can_craft_with_ingredients(@gallo_pinto, 1, 2, 1, 0), "Should not craft with insufficient rice");
        assert(!RecipeTrait::can_craft_with_ingredients(@gallo_pinto, 2, 1, 1, 0), "Should not craft with insufficient beans");
        assert(!RecipeTrait::can_craft_with_ingredients(@gallo_pinto, 2, 2, 0, 0), "Should not craft with insufficient cilantro");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_get_total_ingredients_required() {
        let gallo_pinto = RecipeTrait::new_gallo_pinto(1, 1234567890);
        let casado = RecipeTrait::new_casado(2, 1234567890);

        assert_eq!(RecipeTrait::get_total_ingredients_required(@gallo_pinto), 5, "Gallo Pinto should require 5 ingredients total");
        assert_eq!(RecipeTrait::get_total_ingredients_required(@casado), 3, "Casado should require 3 ingredients total");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_get_difficulty_level() {
        let gallo_pinto = RecipeTrait::new_gallo_pinto(1, 1234567890); // 5 ingredients = Medium
        let casado = RecipeTrait::new_casado(2, 1234567890); // 3 ingredients = Easy

        assert_eq!(RecipeTrait::get_difficulty_level(@gallo_pinto), 2, "Gallo Pinto should be medium difficulty");
        assert_eq!(RecipeTrait::get_difficulty_level(@casado), 1, "Casado should be easy difficulty");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_calculate_final_score() {
        let gallo_pinto = RecipeTrait::new_gallo_pinto(1, 1234567890); // Medium difficulty = 2x multiplier
        let casado = RecipeTrait::new_casado(2, 1234567890); // Easy difficulty = 1x multiplier

        assert_eq!(RecipeTrait::calculate_final_score(@gallo_pinto), 200, "Gallo Pinto final score should be 200 (100 * 2)");
        assert_eq!(RecipeTrait::calculate_final_score(@casado), 150, "Casado final score should be 150 (150 * 1)");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_toggle_active() {
        let mut recipe = RecipeTrait::new_gallo_pinto(1, 1234567890);

        assert(recipe.is_active, "Recipe should be active initially");

        RecipeTrait::toggle_active(ref recipe);
        assert(!recipe.is_active, "Recipe should be inactive after toggle");

        RecipeTrait::toggle_active(ref recipe);
        assert(recipe.is_active, "Recipe should be active after second toggle");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_update_requirements() {
        let mut recipe = RecipeTrait::new_gallo_pinto(1, 1234567890);

        RecipeTrait::update_requirements(
            ref recipe,
            3,   // rice
            3,   // beans
            2,   // cilantro
            1,   // salsa
            200, // base_score
            40,  // health_bonus
            30,  // energy_bonus
        );

        assert_eq!(recipe.rice_required, 3, "Rice requirement should be updated");
        assert_eq!(recipe.beans_required, 3, "Beans requirement should be updated");
        assert_eq!(recipe.cilantro_required, 2, "Cilantro requirement should be updated");
        assert_eq!(recipe.salsa_required, 1, "Salsa requirement should be updated");
        assert_eq!(recipe.base_score, 200, "Base score should be updated");
        assert_eq!(recipe.health_bonus, 40, "Health bonus should be updated");
        assert_eq!(recipe.energy_bonus, 30, "Energy bonus should be updated");
    }
} 