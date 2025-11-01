import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { addRecipe } from "./recipesSlice";
import { useNavigate } from "react-router-dom";
import type { Difficulty } from "./types";


const CreateRecipe: React.FC = () => {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [steps, setSteps] = useState<any[]>([]);
  const [tempIngredient, setTempIngredient] = useState({
    name: "",
    quantity: "",
    unit: "",
  });
  const [tempStep, setTempStep] = useState({
    description: "",
    type: "instruction",
    durationMinutes: "",
  });

  const handleAddIngredient = () => {
    if (!tempIngredient.name || !tempIngredient.quantity || !tempIngredient.unit)
      return alert("Fill all ingredient fields");
    setIngredients([
      ...ingredients,
      { id: uuidv4(), ...tempIngredient, quantity: Number(tempIngredient.quantity) },
    ]);
    setTempIngredient({ name: "", quantity: "", unit: "" });
  };

  const handleAddStep = () => {
    if (!tempStep.description || !tempStep.durationMinutes)
      return alert("Fill all step fields");
    setSteps([
      ...steps,
      {
        id: uuidv4(),
        ...tempStep,
        durationMinutes: Number(tempStep.durationMinutes),
      },
    ]);
    setTempStep({ description: "", type: "instruction", durationMinutes: "" });
  };

  const handleSaveRecipe = () => {
  if (!title || ingredients.length === 0 || steps.length === 0) {
    alert("Please fill all required fields");
    return;
  }

  const newRecipe = {
    id: uuidv4(),
    title,
    difficulty,
    ingredients,
    steps,
    favorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dispatch(addRecipe(newRecipe));
  alert("Recipe saved successfully!");
  navigate("/recipes");
};

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        Create Recipe
      </Typography>

      <TextField
        label="Recipe Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Select
  value={difficulty}
  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
  fullWidth
  sx={{ mb: 3 }}
>
  <MenuItem value="Easy">Easy</MenuItem>
  <MenuItem value="Medium">Medium</MenuItem>
  <MenuItem value="Hard">Hard</MenuItem>
</Select>

      {/* Ingredients */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">Ingredients</Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <TextField
              label="Name"
              value={tempIngredient.name}
              onChange={(e) =>
                setTempIngredient({ ...tempIngredient, name: e.target.value })
              }
            />
            <TextField
              label="Quantity"
              type="number"
              value={tempIngredient.quantity}
              onChange={(e) =>
                setTempIngredient({ ...tempIngredient, quantity: e.target.value })
              }
            />
            <TextField
              label="Unit"
              value={tempIngredient.unit}
              onChange={(e) =>
                setTempIngredient({ ...tempIngredient, unit: e.target.value })
              }
            />
            <Button onClick={handleAddIngredient}>Add</Button>
          </Box>
          <ul>
            {ingredients.map((ing) => (
              <li key={ing.id}>
                {ing.name} - {ing.quantity} {ing.unit}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Steps */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">Steps</Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <TextField
              label="Description"
              value={tempStep.description}
              onChange={(e) =>
                setTempStep({ ...tempStep, description: e.target.value })
              }
            />
            <Select
              value={tempStep.type}
              onChange={(e) => setTempStep({ ...tempStep, type: e.target.value })}
            >
              <MenuItem value="instruction">Instruction</MenuItem>
              <MenuItem value="cooking">Cooking</MenuItem>
            </Select>
            <TextField
              label="Duration (min)"
              type="number"
              value={tempStep.durationMinutes}
              onChange={(e) =>
                setTempStep({ ...tempStep, durationMinutes: e.target.value })
              }
            />
            <Button onClick={handleAddStep}>Add</Button>
          </Box>
          <ul>
            {steps.map((s) => (
              <li key={s.id}>
                {s.description} — {s.durationMinutes} min ({s.type})
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveRecipe}
        sx={{ mt: 2 }}
      >
        Save Recipe
      </Button>
    </Box>
  );
};

export default CreateRecipe;
