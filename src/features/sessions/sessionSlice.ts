import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Recipe } from "../recipes/types";

type SessionByRecipe = {
  currentStepIndex: number;
  isRunning: boolean;
  stepRemainingSec: number;
  overallRemainingSec: number;
  lastTickTs?: number;
};

export type SessionState = {
  activeRecipeId: string | null;
  byRecipeId: Record<string, SessionByRecipe>;
};

const initialState: SessionState = {
  activeRecipeId: null,
  byRecipeId: {},
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    startSession: (
      state,
      action: PayloadAction<{ recipe: Recipe; now: number }>
    ) => {
      const { recipe, now } = action.payload;
      const totalDurationSec = recipe.steps.reduce(
        (acc, s) => acc + s.durationMinutes * 60,
        0
      );
      const firstStepSec = recipe.steps[0]?.durationMinutes * 60 || 0;

      state.activeRecipeId = recipe.id;
      state.byRecipeId[recipe.id] = {
        currentStepIndex: 0,
        isRunning: true,
        stepRemainingSec: firstStepSec,
        overallRemainingSec: totalDurationSec,
        lastTickTs: now,
      };
    },

    pauseSession: (state, action: PayloadAction<{ recipeId: string }>) => {
      const s = state.byRecipeId[action.payload.recipeId];
      if (!s) return;
      s.isRunning = false;
      s.lastTickTs = undefined;
    },

    resumeSession: (
      state,
      action: PayloadAction<{ recipeId: string; now: number }>
    ) => {
      const s = state.byRecipeId[action.payload.recipeId];
      if (!s) return;
      s.isRunning = true;
      s.lastTickTs = action.payload.now;
    },

    stopStep: (state, action: PayloadAction<{ recipeId: string }>) => {
      const s = state.byRecipeId[action.payload.recipeId];
      if (!s) return;
      s.stepRemainingSec = 0;
    },

    tickSecond: (
      state,
      action: PayloadAction<{ now: number; stepDurationSec: number }>
    ) => {
      const recipeId = state.activeRecipeId;
      if (!recipeId) return;
      const s = state.byRecipeId[recipeId];
      if (!s || !s.isRunning || !s.lastTickTs) return;

      const deltaSec = Math.floor((action.payload.now - s.lastTickTs) / 1000);
      if (deltaSec <= 0) return;

      s.lastTickTs = action.payload.now;
      s.stepRemainingSec = Math.max(0, s.stepRemainingSec - deltaSec);
      s.overallRemainingSec = Math.max(0, s.overallRemainingSec - deltaSec);
    },

    nextStep: (state, action: PayloadAction<{ stepDurationSec: number }>) => {
      const recipeId = state.activeRecipeId;
      if (!recipeId) return;
      const s = state.byRecipeId[recipeId];
      if (!s) return;
      s.currentStepIndex += 1;
      s.stepRemainingSec = action.payload.stepDurationSec;
      s.isRunning = true;
      s.lastTickTs = Date.now();
    },

    endSession: (state) => {
      state.activeRecipeId = null;
    },
  },
});

export const {
  startSession,
  pauseSession,
  resumeSession,
  stopStep,
  tickSecond,
  nextStep,
  endSession,
} = sessionSlice.actions;

export default sessionSlice.reducer;
