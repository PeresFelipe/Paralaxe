import { useMemo } from 'react'
import type { DefinicaoDeMasmorra, DefinicaoDeSalaDaMasmorra, ExpedicaoNaMasmorra } from '@paralaxe/dominio'
import { gerarGeometriaDaExpedicao, revelarMapa } from '@/services/visualizacaoDaMasmorra'
import PalcoDaMasmorra from './PalcoDaMasmorra'
import estilos from './CenaDaMasmorra.module.css'

export default function CenaDaMasmorra({ mapa, expedicao, sala }: {
  mapa: DefinicaoDeMasmorra; expedicao: ExpedicaoNaMasmorra; sala: DefinicaoDeSalaDaMasmorra
}) {
  const dungeon = useMemo(() => gerarGeometriaDaExpedicao(mapa, expedicao.semente), [mapa, expedicao.semente])
  const room = dungeon.rooms[mapa.salas.findIndex(item => item.id === sala.id)]
  const geometria = useMemo(() => room ? { dungeon, room } : null, [dungeon, room])
  const salas = useMemo(() => revelarMapa(mapa, expedicao, dungeon), [mapa, expedicao, dungeon])
  const resolvida = expedicao.idsDasSalasResolvidas.includes(sala.id)
  const combate = Boolean(sala.idDaDefinicaoDoInimigo)
  return <section className={estilos.cena} aria-label="Cena da sala e mapa da expedição">
    <div className={estilos.legenda}><span>Expedição solo · {sala.tipo}</span><strong role="status">{resolvida ? 'Sala concluída' : combate ? 'Encontro à frente' : 'Explore a sala'}</strong></div>
    {geometria && <PalcoDaMasmorra key={sala.id} geometria={geometria} sala={sala} resolvida={resolvida} />}
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
