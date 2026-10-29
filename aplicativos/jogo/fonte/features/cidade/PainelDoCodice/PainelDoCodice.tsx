import { ENTRADAS_DO_CODICE, type CategoriaDoCodice } from '@greywake/conteudo'
import type { PartidaLocal } from '@greywake/dominio'
import { Button, Card } from '@/components/ui'

const rotulos: Record<CategoriaDoCodice, string> = { classe: 'Classes', oficio: 'Ofícios', atividade: 'Atividades', receita: 'Receitas', material: 'Materiais', equipamento: 'Equipamentos', tecnica: 'Técnicas', inimigo: 'Inimigos', masmorra: 'Masmorras', sala: 'Salas' }

export default function PainelDoCodice({ partida, aoVoltar }: { partida: PartidaLocal; aoVoltar: () => void }) {
  const descobertos = new Set(partida.codice.idsDescobertos)
  const categorias = [...new Set(ENTRADAS_DO_CODICE.map((entrada) => entrada.categoria))]
  return <section className="funcionalidade-telaDoJogo">
    <div className="telaDoJogo-tituloDaSecao"><div><p className="secao-chamada">Cidade · Arquivo</p><h1 className="destaque-titulo">Códice</h1><p className="atenuado">Um registro do que você encontrou e aprendeu em suas jornadas.</p></div><Button variant="secondary" size="sm" onClick={aoVoltar}>Voltar à Cidade</Button></div>
    <Card><p className="secao-chamada">Descobertas</p><h2>{descobertos.size} / {ENTRADAS_DO_CODICE.length} registradas</h2><p className="atenuado">O Códice guarda descobertas por personagem. Conteúdo ainda desconhecido permanece oculto.</p></Card>
    {categorias.map((categoria) => {
      const entradas = ENTRADAS_DO_CODICE.filter((entrada) => entrada.categoria === categoria)
      const conhecidas = entradas.filter((entrada) => descobertos.has(entrada.id))
      return <section className="secao-espacamento" key={categoria}><div className="telaDoJogo-tituloDaSecao"><h2>{rotulos[categoria]}</h2><span>{conhecidas.length} / {entradas.length}</span></div><div className="visaoGeral-pilha">{conhecidas.length ? conhecidas.map((entrada) => <Card key={entrada.id}><h3>{entrada.nome}</h3><p className="atenuado">{entrada.descricao}</p></Card>) : <Card><p className="atenuado">Ainda não há descobertas nesta categoria.</p></Card>}</div></section>
    })}
  </section>
}
