import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { tickSecond, nextStep, endSession } from "../features/sessions/sessionSlice";
import type { RootState } from "../app/store";

export function useSessionTimer() {
  const dispatch = useAppDispatch();
  const { activeRecipeId, byRecipeId } = useAppSelector(
    (state: RootState) => state.session
  );
  const recipes = useAppSelector((state) => state.recipes.items);

  const recipe = recipes.find((r) => r.id === activeRecipeId);

  useEffect(() => {
    if (!activeRecipeId || !recipe) return;
    const session = byRecipeId[activeRecipeId];
    if (!session?.isRunning) return;

    // store the last timestamp for drift-free ticking
    let lastTick = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - lastTick) / 1000);

      if (elapsed >= 1) {
        lastTick = now;

        dispatch(
          tickSecond({
            now,
            stepDurationSec:
              recipe.steps[session.currentStepIndex].durationMinutes * 60,
          })
        );

        // Get the latest session state after ticking
        const currentSession = byRecipeId[activeRecipeId];
        if (!currentSession) return;

        // If step time has ended, move to next step or finish
        if (currentSession.stepRemainingSec <= 0) {
          const nextIndex = currentSession.currentStepIndex + 1;
          if (nextIndex < recipe.steps.length) {
            dispatch(
              nextStep({
                stepDurationSec:
                  recipe.steps[nextIndex].durationMinutes * 60,
              })
            );
          } else {
            dispatch(endSession());
            clearInterval(interval);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeRecipeId, recipe, byRecipeId, dispatch]);
}
