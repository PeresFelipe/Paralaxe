/**
 * @file Entrada do navegador: carrega estilos e monta a aplicação React no HTML.
 * O StrictMode ajuda a detectar problemas de efeitos durante o desenvolvimento.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { criarRepositorioDePartidasIndexedDb } from '@greywake/persistencia'
import Aplicativo from './Aplicativo'
import { KitDeInterface } from './features/ui-kit/KitDeInterface'
// A ordem das folhas importa: a base vem primeiro, seguida dos ajustes de disposição,
// tipografia, tema e componentes. Regras posteriores podem sobrescrever as anteriores.
import './styles/tokens.css'
import './estilos.css'
import './arte-gerada.css'
import './disposicao-compacta.css'
import './tipografia.css'
import './tema-do-jogo.css'
import './jornada.css'
import './interface-do-jogo.css'
import './responsivo-refinamento.css'

const raizElemento = document.getElementById("raiz")
const repositorioDePartidas = criarRepositorioDePartidasIndexedDb()

// Falha explicitamente se index.html não oferecer o ponto de montagem esperado.
if (!raizElemento) {
  throw new Error('Elemento #raiz não encontrado.')
}

createRoot(raizElemento).render(
  <StrictMode>
    {import.meta.env.DEV && window.location.pathname === '/ui-kit'
      ? <KitDeInterface />
      : <Aplicativo repositorioDePartidas={repositorioDePartidas} />}
  </StrictMode>,
)
