import type { Recipe } from './types'


const KEY = 'recipes:v1'


export function loadRecipes(): Recipe[] {
try {
const raw = localStorage.getItem(KEY)
if (!raw) return []
const parsed = JSON.parse(raw)
if (!Array.isArray(parsed)) return []
return parsed
} catch (e) {
console.warn('Failed to load recipes', e)
return []
}
}


export function saveRecipes(recipes: Recipe[]) {
try {
localStorage.setItem(KEY, JSON.stringify(recipes))
} catch (e) {
console.warn('Failed to save recipes', e)
}
}