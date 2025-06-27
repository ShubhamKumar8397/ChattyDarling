import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline } from '@mui/material'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <CssBaseline />
      <App/>
    </HelmetProvider>
  </StrictMode>
)
