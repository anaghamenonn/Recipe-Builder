// src/features/recipes/EditRecipe.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { updateRecipe } from "./recipesSlice";
import type { Recipe, Ingredient, RecipeStep } from "./types";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const EditRecipe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const recipe = useAppSelector((state) =>
    state.recipes.items.find((r) => r.id === id)
  );

  const [form, setForm] = useState<Recipe | null>(null);

  useEffect(() => {
    if (recipe) setForm(recipe);
  }, [recipe]);

  if (!form) return <Typography textAlign="center">Recipe not found.</Typography>;

  // ---------- General Field Change ----------
  const handleChange = (field: keyof Recipe, value: any) => {
    setForm({ ...form, [field]: value });
  };

  // ---------- Ingredient Handlers ----------
  const handleIngredientChange = (index: number, field: keyof Ingredient, value: any) => {
    const updated = [...form!.ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form!, ingredients: updated });
  };

  const handleAddIngredient = () => {
    setForm({
      ...form!,
      ingredients: [
        ...form!.ingredients,
        { id: crypto.randomUUID(), name: "", quantity: 0, unit: "" },
      ],
    });
  };

  const handleDeleteIngredient = (index: number) => {
    const updated = form!.ingredients.filter((_, i) => i !== index);
    setForm({ ...form!, ingredients: updated });
  };

  // ---------- Step Handlers ----------
  const handleStepChange = (index: number, field: keyof RecipeStep, value: any) => {
    const updated = [...form!.steps];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form!, steps: updated });
  };

  const handleAddStep = () => {
    setForm({
      ...form!,
      steps: [
        ...form!.steps,
        {
          id: crypto.randomUUID(),
          description: "",
          type: "instruction",
          durationMinutes: 0,
        },
      ],
    });
  };

  const handleDeleteStep = (index: number) => {
    const updated = form!.steps.filter((_, i) => i !== index);
    setForm({ ...form!, steps: updated });
  };

  // ---------- Save ----------
  const handleSave = () => {
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }
    dispatch(updateRecipe(form));
    navigate("/recipes");
  };

  return (
    <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
      <Paper sx={{ p: 4, width: "700px" }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          ✏️ Edit Recipe
        </Typography>

        <Stack spacing={2}>
          {/* Basic Fields */}
          <TextField
            label="Title"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />
          <TextField
            label="Difficulty"
            value={form.difficulty}
            onChange={(e) => handleChange("difficulty", e.target.value)}
          />
          <TextField
            label="Cuisine"
            value={form.cuisine}
            onChange={(e) => handleChange("cuisine", e.target.value)}
          />

          {/* Ingredients Section */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">🧂 Ingredients</Typography>
          {form.ingredients.map((ing, index) => (
            <Stack key={ing.id} direction="row" spacing={2} alignItems="center">
              <TextField
                label="Name"
                value={ing.name}
                onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                fullWidth
              />
              <TextField
                label="Quantity"
                type="number"
                value={ing.quantity}
                onChange={(e) =>
                  handleIngredientChange(index, "quantity", Number(e.target.value))
                }
                sx={{ width: 120 }}
              />
              <TextField
                label="Unit"
                value={ing.unit}
                onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                sx={{ width: 120 }}
              />
              <IconButton color="error" onClick={() => handleDeleteIngredient(index)}>
                <Delete />
              </IconButton>
            </Stack>
          ))}
          <Button
            startIcon={<Add />}
            variant="outlined"
            onClick={handleAddIngredient}
            sx={{ width: "fit-content" }}
          >
            Add Ingredient
          </Button>

          {/* Steps Section */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">📜 Steps</Typography>
          {form.steps.map((step, index) => (
            <Stack key={step.id} direction="row" spacing={2} alignItems="center">
              <TextField
                label={`Step ${index + 1} Description`}
                value={step.description}
                onChange={(e) => handleStepChange(index, "description", e.target.value)}
                fullWidth
              />
              <TextField
                label="Duration (mins)"
                type="number"
                value={step.durationMinutes}
                onChange={(e) =>
                  handleStepChange(index, "durationMinutes", Number(e.target.value))
                }
                sx={{ width: 160 }}
              />
              <IconButton color="error" onClick={() => handleDeleteStep(index)}>
                <Delete />
              </IconButton>
            </Stack>
          ))}
          <Button
            startIcon={<Add />}
            variant="outlined"
            onClick={handleAddStep}
            sx={{ width: "fit-content" }}
          >
            Add Step
          </Button>

          <Divider sx={{ my: 2 }} />

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save Changes
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => navigate("/recipes")}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default EditRecipe;
