import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Aplicativo from './Aplicativo'
import './estilos.css'
import './progresso-ocioso.css'
import './arte-gerada.css'
import './disposicao-compacta.css'
import './tipografia.css'
import './tema-do-jogo.css'
import './jornada.css'

const raizElemento = document.getElementById("raiz")

if (!raizElemento) {
  throw new Error('Elemento #raiz não encontrado.')
}

createRoot(raizElemento).render(
  <StrictMode>
    <Aplicativo />
  </StrictMode>,
)
