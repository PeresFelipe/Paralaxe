import { useMemo } from 'react'
import type { DefinicaoDeMasmorra, DefinicaoDeSalaDaMasmorra, ExpedicaoNaMasmorra } from '@paralaxe/dominio'
import { revelarMapa } from '@/services/visualizacaoDaMasmorra'
import { projectHex, pontosDoHexagono } from '@/terceiros/hexaBattle/projecaoIsometrica'
import estilos from './CenaDaMasmorra.module.css'

const piso = Array.from({ length: 7 }, (_, q) => Array.from({ length: 7 }, (_, r) => ({ q, r, ...projectHex({ q, r }) }))).flat()

export default function CenaDaMasmorra({ mapa, expedicao, sala }: {
  mapa: DefinicaoDeMasmorra; expedicao: ExpedicaoNaMasmorra; sala: DefinicaoDeSalaDaMasmorra
}) {
  const salas = useMemo(() => revelarMapa(mapa, expedicao), [mapa, expedicao])
  const resolvida = expedicao.idsDasSalasResolvidas.includes(sala.id)
  const combate = Boolean(sala.idDaDefinicaoDoInimigo)
  return <section className={estilos.cena} aria-label="Cena da sala e mapa da expedição">
    <div className={estilos.legenda}><span>Expedição solo · {sala.tipo}</span><strong role="status">{resolvida ? 'Sala concluída' : combate ? 'Encontro à frente' : 'Explore a sala'}</strong></div>
    <svg key={sala.id} className={estilos.palco} viewBox="-35 -35 250 290" role="img" aria-label={`${sala.nome}: aventureiro diante de ${resolvida ? 'uma sala concluída' : combate ? 'um inimigo' : sala.tipo === 'recuperacao' ? 'uma fogueira' : 'um ponto de exploração'}`}>
      <g className={estilos.piso}>{piso.map(p => <polygon key={`${p.q}-${p.r}`} points={pontosDoHexagono} transform={`translate(${p.x} ${p.y})`} />)}</g>
      <g transform="translate(35 128)" className={estilos.heroi}>
        <ellipse cy="25" rx="17" ry="6" className={estilos.sombra}/><path d="M-12 22 L-8-6 Q0-18 8-6 L12 22Z"/><circle cy="-17" r="8"/><path d="M-17-1 L-17 21 M-23 5 L-11 5" className={estilos.arma}/>
      </g>
      <g transform="translate(140 155)" className={resolvida ? estilos.concluida : estilos.encontro}>
        <ellipse cy="20" rx="20" ry="6" className={estilos.sombra}/>
        {resolvida ? <path d="M-12 0 L-3 10 L17-13" className={estilos.arma}/> : combate ? <><path d="M-18 19 L-13-8 L-22-24 L-4-14 L10-24 L14-5 L20 19Z"/><circle cx="-5" cy="-5" r="2"/><circle cx="6" cy="-5" r="2"/></> : sala.tipo === 'recuperacao' ? <path d="M0-25 Q25 0 10 14 Q-20 26-15 1 L-4 8Z"/> : <><path d="M-20-5 Q0-24 20-5 V20 H-20Z"/><path d="M-20 2 H20 M0-13 V20" className={estilos.arma}/></>}
      </g>
      <text x="35" y="178" textAnchor="middle">Você</text><text x="140" y="198" textAnchor="middle">{resolvida ? 'Concluído' : combate ? 'Encontro' : 'Explorar'}</text>
    </svg>
    <details className={estilos.mapa}><summary>Mapa explorado · {expedicao.idsDasSalasVisitadas.length} salas visitadas</summary>
      <svg viewBox="0 0 240 180" role="img" aria-label="Percurso revelado; círculos vazios são saídas ainda não visitadas">
        {mapa.salas.flatMap(origem => origem.idsDasProximasSalas.map(destino => {
          const a = salas.find(s => s.id === origem.id); const b = salas.find(s => s.id === destino)
          return a?.visitada && b ? <line key={`${origem.id}-${destino}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}/> : null
        }))}
        {salas.map(s => <g key={s.id}><title>{s.visitada ? mapa.salas.find(def => def.id === s.id)?.nome : 'Saída não explorada'}</title><circle cx={s.x} cy={s.y} r={s.estado === 'active' ? 4 : 2.5} className={s.visitada ? estilos.visitada : estilos.desconhecida}/></g>)}
      </svg><p>O mapa mostra o percurso conhecido. Escolha as próximas salas pelos botões de caminho.</p>
    </details>
  </section>
}
