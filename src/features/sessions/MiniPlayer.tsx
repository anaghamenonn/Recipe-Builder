import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../app/store'
import {
  Paper,
  Box,
  Typography,
  IconButton,
  LinearProgress,
} from '@mui/material'
import PlayArrow from '@mui/icons-material/PlayArrow'
import Pause from '@mui/icons-material/Pause'
import Stop from '@mui/icons-material/Stop'
import CloseIcon from '@mui/icons-material/Close'
import { pauseSession, resumeSession, stopStep, endSession } from '../sessions/sessionSlice'
import { useNavigate } from 'react-router-dom'
import { mmss } from '../../utils/time'
import type { Recipe } from '../recipes/types'

export default function MiniPlayer({ currentPath }: { currentPath: string }) {
  const sessionState = useSelector((s: RootState) => s.session)
  const recipes = useSelector((s: RootState) => s.recipes.items)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const activeId = sessionState.activeRecipeId
  if (!activeId) return null
  if (currentPath === `/cook/${activeId}`) return null

  const s = sessionState.byRecipeId[activeId]
  if (!s) return null

  const recipe: Recipe | undefined = recipes.find((r) => r.id === activeId)
  if (!recipe) return null

  const step = recipe.steps[s.currentStepIndex]
  const stepDur = step.durationMinutes * 60
  const stepPercent = Math.round(
    ((stepDur - s.stepRemainingSec) / stepDur) * 100
  )

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: 340,
        p: 2,
        boxShadow: 6,
        borderRadius: 3,
        background: '#fffef9',
        cursor: 'pointer',
        transition: '0.3s',
        '&:hover': { boxShadow: 10 },
      }}
      onClick={() => navigate(`/cook/${activeId}`)}
    >
      {/* Header Row with Title + Close Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {recipe.title}
        </Typography>

        {/* ❌ Close Button */}
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            dispatch(endSession())
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Status + Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Step {s.currentStepIndex + 1} · {mmss(s.stepRemainingSec)} ·{' '}
          {s.isRunning ? 'Running' : 'Paused'}
        </Typography>

        <div>
          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              s.isRunning
                ? dispatch(pauseSession({ recipeId: activeId }))
                : dispatch(resumeSession({ recipeId: activeId, now: Date.now() }))
            }}
          >
            {s.isRunning ? <Pause /> : <PlayArrow />}
          </IconButton>

          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              dispatch(stopStep({ recipeId: activeId }))
            }}
          >
            <Stop />
          </IconButton>
        </div>
      </Box>

      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={stepPercent}
        sx={{ height: 6, borderRadius: 3, mt: 1 }}
      />
    </Paper>
  )
}
