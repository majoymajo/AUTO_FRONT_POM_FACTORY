import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'
import { GlobalErrorBoundary } from './components/common/GlobalErrorBoundary'

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
    <Toaster position="top-center" richColors closeButton />
  </StrictMode>,
)

