import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Punto de arranque de la app React.
// Monta el árbol de componentes dentro de #root
// y aplica React.StrictMode en desarrollo.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
