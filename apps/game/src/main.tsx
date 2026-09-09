import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import CombatWorkbench from './CombatWorkbench'
import './styles.css'
import './combat.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Elemento #root não encontrado.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
    <CombatWorkbench />
  </StrictMode>,
)
