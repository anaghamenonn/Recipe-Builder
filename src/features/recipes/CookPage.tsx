import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../app/store'
import {
  startSession,
  pauseSession,
  resumeSession,
  stopStep,
} from '../sessions/sessionSlice'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useSessionTimer } from '../../hooks/useSessionTimer'

export default function CookPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const recipe = useSelector((state: RootState) =>
    state.recipes.items.find((r) => r.id === id)
  )

  const session = useSelector((state: RootState) =>
    id ? state.session.byRecipeId[id] : undefined
  )

  if (!recipe) return <Typography>Recipe not found.</Typography>

  const totalSec = recipe.steps.reduce(
    (a: number, s: any) => a + s.durationMinutes * 60,
    0
  )

  const currentIndex = session?.currentStepIndex ?? 0
  const currentStep = recipe.steps[currentIndex]
  const stepDurationSec = currentStep?.durationMinutes * 60 || 0
  const stepRemaining = session ? session.stepRemainingSec : stepDurationSec
  const stepElapsed = stepDurationSec - stepRemaining
  const stepPercent = stepDurationSec
    ? Math.round((stepElapsed / stepDurationSec) * 100)
    : 0
  const overallRemaining = session ? session.overallRemainingSec : totalSec
  const overallElapsed = totalSec - overallRemaining
  const overallPercent = totalSec
    ? Math.round((overallElapsed / totalSec) * 100)
    : 0

  const handleStart = () => {
    if (!session) dispatch(startSession({ recipe, now: Date.now() }))
  }

  const handlePauseResume = () => {
    if (!session) return
    if (session.isRunning)
      dispatch(pauseSession({ recipeId: recipe.id }))
    else dispatch(resumeSession({ recipeId: recipe.id, now: Date.now() }))
  }

  const handleNextStep = () => {
    if (!session) return
    dispatch(stopStep({ recipeId: recipe.id }))
  }

  const handleBack = () => {
    navigate('/recipes')
  }

  useSessionTimer()

  return (
    <Container>
      <Paper sx={{ p: 4, mt: 3, borderRadius: 3, boxShadow: 3 }}>
        {/* Back Button */}
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2, color: '#000' }}
        >
          Back to Recipes
        </Button>

        <Typography variant="h4" gutterBottom>
          🍳 Cooking: {recipe.title}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Step {currentIndex + 1} of {recipe.steps.length}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {currentStep?.description || 'No description available'}
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <CircularProgress
            variant="determinate"
            value={stepPercent}
            size={70}
            color="primary"
          />
          <Typography variant="body1">{stepPercent}% done</Typography>
          <Chip
            label={session?.isRunning ? 'Running ⏱️' : 'Paused 💤'}
            color={session?.isRunning ? 'success' : 'warning'}
          />
        </Stack>

        <LinearProgress
          variant="determinate"
          value={overallPercent}
          sx={{ height: 10, borderRadius: 5, mb: 3 }}
        />
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Overall Progress: {overallPercent}%
        </Typography>

        <Stack direction="row" spacing={2}>
          {!session ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleStart}
            >
              ▶ Start Cooking
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePauseResume}
              >
                {session.isRunning ? 'Pause' : 'Resume'}
              </Button>
              <Button
                variant="outlined"
                color="success"
                onClick={handleNextStep}
              >
                Next Step →
              </Button>
            </>
          )}
        </Stack>
      </Paper>
    </Container>
  )
}
