// src/features/recipes/RecipeList.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import { Delete, Edit, Favorite, FavoriteBorder, RestaurantMenu } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { deleteRecipe, toggleFavorite } from "./recipesSlice";
import Grid from "@mui/material/Grid";


const RecipeList: React.FC = () => {
  const recipes = useAppSelector((state) => state.recipes.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const filteredRecipes = recipes
    .filter((r) => (filter ? r.difficulty === filter : true))
    .sort((a, b) => {
      const timeA = a.steps.reduce((t, s) => t + s.durationMinutes, 0);
      const timeB = b.steps.reduce((t, s) => t + s.durationMinutes, 0);
      return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
    });

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          🍽️ Recipe List
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/create")}
          startIcon={<RestaurantMenu />}
        >
          Add New Recipe
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} mb={3}>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Filter by Difficulty</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Filter by Difficulty"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Sort by Time</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            label="Sort by Time"
          >
            <MenuItem value="asc">Shortest First</MenuItem>
            <MenuItem value="desc">Longest First</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {filteredRecipes.length === 0 ? (
        <Typography textAlign="center" color="text.secondary" mt={5}>
          😔 No recipes yet. Click <b>Add New Recipe</b> to get started!
        </Typography>
      ) : (
        <Grid container spacing={3} component="div">
  {filteredRecipes.map((recipe) => (
    <Grid item xs={12} sm={6} md={4} key={recipe.id} component="div">
      <Card
        sx={{
          p: 1,
          borderRadius: 3,
          boxShadow: 3,
          transition: "0.3s",
          "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            {recipe.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Difficulty: {recipe.difficulty}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cuisine: {recipe.cuisine}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Box>
            <IconButton
              color={recipe.favorite ? "error" : "default"}
              onClick={() => dispatch(toggleFavorite(recipe.id))}
            >
              {recipe.favorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <IconButton onClick={() => navigate(`/edit/${recipe.id}`)}>
              <Edit />
            </IconButton>
            <IconButton color="error" onClick={() => dispatch(deleteRecipe(recipe.id))}>
              <Delete />
            </IconButton>
          </Box>
          <Button size="small" onClick={() => navigate(`/cook/${recipe.id}`)}>
            Cook
          </Button>
        </CardActions>
      </Card>
    </Grid>
  ))}
</Grid>

      )}
    </Box>
  );
};

export default RecipeList;
