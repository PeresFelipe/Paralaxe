/**
 * @file Entrada do navegador: carrega estilos e monta a aplicação React no HTML.
 * O StrictMode ajuda a detectar problemas de efeitos durante o desenvolvimento.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Aplicativo from './Aplicativo'
// A ordem das folhas importa: a base vem primeiro, seguida dos ajustes de disposição,
// tipografia, tema e componentes. Regras posteriores podem sobrescrever as anteriores.
import './estilos.css'
import './progresso-ocioso.css'
import './arte-gerada.css'
import './disposicao-compacta.css'
import './tipografia.css'
import './tema-do-jogo.css'
import './jornada.css'
import './creditos.css'

const raizElemento = document.getElementById("raiz")

// Falha explicitamente se index.html não oferecer o ponto de montagem esperado.
if (!raizElemento) {
  throw new Error('Elemento #raiz não encontrado.')
}

createRoot(raizElemento).render(
  <StrictMode>
    <Aplicativo />
  </StrictMode>,
)
