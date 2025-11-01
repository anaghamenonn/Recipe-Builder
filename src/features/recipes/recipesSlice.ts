// src/features/recipes/recipesSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loadRecipes, saveRecipes } from "./recipesLocalStorage";
import type { Recipe } from "./types";

interface RecipesState {
  items: Recipe[];
}

const initialState: RecipesState = {
  items: loadRecipes() || [],
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    addRecipe: (state, action: PayloadAction<Recipe>) => {
      const newRecipe = {
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.items.push(newRecipe);
      saveRecipes(state.items as Recipe[]);
    },
    updateRecipe: (state, action: PayloadAction<Recipe>) => {
      const index = state.items.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        saveRecipes(state.items as Recipe[]);
      }
    },
    deleteRecipe: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((r) => r.id !== action.payload);
      saveRecipes(state.items as Recipe[]);
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const recipe = state.items.find((r) => r.id === action.payload);
      if (recipe) {
        recipe.favorite = !recipe.favorite;
        recipe.updatedAt = new Date().toISOString();
        saveRecipes(state.items as Recipe[]);
      }
    },
  },
});

export const { addRecipe, updateRecipe, deleteRecipe, toggleFavorite } =
  recipesSlice.actions;

export default recipesSlice.reducer;
