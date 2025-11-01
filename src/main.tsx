import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import AppRoutes from './routes/AppRoutes'
import { store } from './app/store'
import { useSessionTimer } from './hooks/useSessionTimer'
import './index.css'


const theme = createTheme({
palette: {
mode: 'light',
primary: { main: '#F4CE14' },
},
})


function AppWrapper() {
useSessionTimer()
return <AppRoutes />
}


createRoot(document.getElementById('root')!).render(
<React.StrictMode>
<Provider store={store}>
<ThemeProvider theme={theme}>
<CssBaseline />
<BrowserRouter>
<AppWrapper />
</BrowserRouter>
</ThemeProvider>
</Provider>
</React.StrictMode>
)