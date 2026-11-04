import { DESAFIOS } from '@paralaxe/conteudo'
import type { PartidaLocal } from '@paralaxe/dominio'
import { Button, Card, ProgressBar } from '@/components/ui'

export default function PainelDeDesafios({ partida, aoVoltar }: { partida: PartidaLocal; aoVoltar: () => void }) {
  const concluidos = new Set(partida.desafios.idsConcluidos)
  return <section className="funcionalidade-telaDoJogo">
    <div className="telaDoJogo-tituloDaSecao"><div><p className="secao-chamada">Aventura · Marcos</p><h1 className="destaque-titulo">Desafios</h1><p className="atenuado">Feitos para acompanhar sua jornada. Os registros são locais e não concedem moeda.</p></div><Button variant="secondary" size="sm" onClick={aoVoltar}>Voltar à Aventura</Button></div>
    <Card><p className="secao-chamada">Desafios concluídos</p><h2>{concluidos.size} / {DESAFIOS.length}</h2></Card>
    <div className="visaoGeral-pilha secao-espacamento">{DESAFIOS.map((desafio) => {
      const progresso = Math.min(desafio.alvo, desafio.progresso(partida))
      const concluido = concluidos.has(desafio.id)
      return <Card key={desafio.id}><p className="secao-chamada">{concluido ? 'Concluído' : 'Em andamento'}</p><h2>{desafio.nome}</h2><p className="atenuado">{desafio.descricao}</p><ProgressBar max={desafio.alvo} value={progresso} label={`Progresso: ${desafio.nome}`} /><p>{progresso} / {desafio.alvo}</p></Card>
    })}</div>
  </section>
}
