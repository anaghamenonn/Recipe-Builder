# 🍳 Recipe Builder & Cooking Session App

This is a React + Redux Toolkit web application lets users create, manage, and simulate cooking recipes — including per-step timers, cooking progress, pause/resume functionality, and a global mini-player.  
All recipe data is persisted locally using localStorage, ensuring smooth, backend-free operation.


## 🚀 Live Demo

🔗 **Deployed on Vercel:** [https://recipe-builder-ovk5y01lx-anagha-menons-projects.vercel.app/](https://recipe-builder-ovk5y01lx-anagha-menons-projects.vercel.app/)


## 🧩 Overview

This project simulates the behavior of a Smart Cooking Companion, where each recipe contains a series of timed steps that can be followed in real-time with progress indicators, step transitions, and a global mini-player for easy tracking — all built using modern React and Redux patterns.

Users can:
- Create and edit custom recipes.
- Add ingredients and ordered steps with cooking settings.
- Simulate cooking sessions step-by-step.
- Track overall and per-step progress in real time.
- Pause, resume, and stop cooking sessions seamlessly.

## 🧰 Tech Stack

| Category               | Tools                 |
| ---------------------- | --------------------- |
| **Frontend Framework** | React 18 + TypeScript |
| **State Management**   | Redux Toolkit         |
| **Routing**            | React Router v6       |
| **UI Library**         | MUI v5                |
| **Styling**            | MUI + CSS Modules     |
| **Storage**            | Browser LocalStorage  |
| **Deployment**         | Vercel                |
| **Build Tool**         | Vite                  |

## 🖥️ Deployment

This project was deployed using Vercel for quick CI/CD and instant hosting.

Live URL:
👉 https://recipe-builder-ovk5y01lx-anagha-menons-projects.vercel.app/

To run locally:

# 1. Clone repository
```
git clone https://github.com/anaghamenonn/Recipe-Builder.git
cd recipe-builder
```

# 2. Install dependencies
```
npm install
```

# 3. Start development server
```
npm run dev
```

## ✨ Features

### 🧱 Recipe Builder (`/create`)
- Create recipes with:
  - Title, cuisine, and difficulty (`Easy`, `Medium`, `Hard`).
  - Ingredient list with name, quantity, and unit.
  - Ordered steps (either **instruction** or **cooking** type).
- For `cooking` steps → require temperature & speed.
- For `instruction` steps → link ingredients.
- Validation rules:
  - At least one ingredient and one step.
  - Duration > 0 for all steps.
  - Type-based field restrictions enforced.

### 📚 Recipe List (`/recipes`)
- View all recipes with:
  - Title, difficulty chip, total time, and favorite toggle.
- Filter by difficulty.
- Sort by total cooking time (ascending/descending).
- Edit or delete recipes.
- Click a recipe to start the cooking session.

### ⏱ Cooking Session (`/cook/:id`)
- Linear step-by-step flow.
- Real-time per-step and overall progress indicators.
- Buttons:
  - `Start Session`
  - `Pause/Resume`
  - `STOP` (ends only the current step)
- Auto-advance to the next step when time runs out.
- Ends automatically after the final step.
- No manual step navigation (linear flow enforced).
- Accessibility features (aria values, spacebar control).

### 🎵 Global Mini Player
- Displays on all routes except the active `/cook/:id`.
- Shows:
  - Recipe title
  - Current step
  - Tiny circular progress
  - Pause/Resume and Stop controls
- Clicking it navigates back to the active cooking session.

### 💾 Persistence
- Recipes are stored in `localStorage` (`recipes:v1`).
- Session data remains in-memory (resets on refresh).
