// import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Container from '@mui/material/Container'
// import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import RecipesList from '../features/recipes/RecipeList'
import CreateRecipe from '../features/recipes/CreateRecipe'
import EditRecipe from '../features/recipes/EditRecipe'
import CookPage from '../features/recipes/CookPage'
import MiniPlayer from '../features/sessions/MiniPlayer'


export default function AppRoutes() {
const loc = useLocation()
return (
<div className="app-shell">
<AppBar position="static" color="default">
<Toolbar>
<Typography variant="h6" sx={{ flexGrow: 1 }}>Recipe Builder</Typography>
<Button component={Link} to="/recipes">Recipes</Button>
<Button component={Link} to="/create">Create Recipe</Button>
</Toolbar>
</AppBar>
<Container className="container">
<Routes>
<Route path="/" element={<RecipesList />} />
<Route path="/recipes" element={<RecipesList />} />
<Route path="/create" element={<CreateRecipe />} />
<Route path="/edit/:id" element={<EditRecipe />} />
<Route path="/cook/:id" element={<CookPage />} />
</Routes>
</Container>
{/* Mini player: hide when on /cook/:activeId (handled inside) */}
<MiniPlayer currentPath={loc.pathname} />
</div>
)
}