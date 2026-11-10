/**
 * @file Interface das compras no mercado PNJ.
 * Exibe as ofertas do catálogo e o saldo atual; a regra de compra no domínio calcula
 * a nova partida com débito e entrega, que é enviada ao callback de persistência.
 */
import { useState } from 'react'
import { OFERTAS_INICIAIS_DO_MERCADO_DE_PNJ } from '@paralaxe/conteudo'
import { obterUsoDeEspacosDoInventario, obterLimiteDeEspacosDoInventario, type PartidaLocal } from '@paralaxe/dominio'
import { Button, Card } from '@/components/ui'
import IconeDoJogo from '@/components/jogo/IconeDoJogo'
import { obterIconeDoProduto } from '@/iconesDosRecursos'
import { rotulosDaInterface } from '@/rotulosDaInterface'
import estilos from './BancadaDoMercado.module.css'

type PropriedadesDaTelaDeMercado = {
  partida: PartidaLocal
  aoComprarOferta: (idDaOferta: string) => Promise<void>
  aoVoltar: () => void
}

/** Mantém apenas mensagem e bloqueio de operação; os produtos e preços vêm do catálogo fixo. */
export default function BancadaDoMercado({ partida, aoComprarOferta, aoVoltar }: PropriedadesDaTelaDeMercado) {
  const [mensagem, definirMensagem] = useState<string | null>(null)
  const [ofertaEmCompra, definirOfertaEmCompra] = useState<string | null>(null)

  /** Resolve o ID da oferta, bloqueia reenvios durante a Promise e só anuncia sucesso depois de salvar. */
  async function comprar(ofertaId: string) {
    if (ofertaEmCompra) return
    const oferta = OFERTAS_INICIAIS_DO_MERCADO_DE_PNJ.find((item) => item.id === ofertaId)
    if (!oferta) return

    definirOfertaEmCompra(oferta.id)
    try {
      await aoComprarOferta(oferta.id)
      definirMensagem(`${oferta.nome} comprado por ${oferta.preco} moedas.`)
    } catch (erro) {
      definirMensagem(erro instanceof Error ? erro.message : 'Não foi possível concluir a compra.')
    } finally {
      definirOfertaEmCompra(null)
    }
  }

  return (
    <section className="funcionalidade-telaDoJogo mercado-telaDoJogo" aria-labelledby="mercado-titulo">
      <div className="telaDoJogo-tituloDaSecao">
        <div>
          <p className="secao-chamada">Cidade · Mercado</p>
          <h2 id="mercado-titulo" className="destaque-titulo">Mercado</h2>
        </div>
        <div className={estilos.headerActions}>
          <div className="moedaCorrente-selo" aria-label={`${partida.personagem.ouro} moedas`}>
            <span aria-hidden="true">◇</span>
            <strong>{partida.personagem.ouro}</strong>
            <small>moedas</small>
          </div>
          <Button variant="secondary" size="sm" onClick={aoVoltar}>
            {rotulosDaInterface.voltarACidade}
          </Button>
        </div>
      </div>

      <div className={`contexto-arte contexto-arte--compacto ${estilos.art}`} aria-hidden="true">
        <span>ARTE 16:9 · MERCADO</span>
      </div>
      <p className="atenuado">Inventário: {obterUsoDeEspacosDoInventario(partida)} / {obterLimiteDeEspacosDoInventario(partida)} espaços. A compra entrega o item na bolsa.</p>
      {mensagem ? <p className="emLinha-mensagem" role="status">{mensagem}</p> : null}

      <div className={estilos.offers}>
        {OFERTAS_INICIAIS_DO_MERCADO_DE_PNJ.map((oferta) => {
          // O saldo orienta a interface; a capacidade do inventário continua sendo validada pela regra de compra.
          const podePagar = partida.personagem.ouro >= oferta.preco
          const possuido = oferta.produto.tipo === 'equipamento'
            ? partida.personagem.itensDeEquipamento.filter(i => i.idDaDefinicao === oferta.produto.idDaDefinicao).length
            : partida.personagem.inventario.find(i => i.idDaDefinicao === oferta.produto.idDaDefinicao)?.quantidade ?? 0
          return (
            <Card appearance="soft" className="item-cartao" key={oferta.id}>
              <div className="item-miniatura" aria-hidden="true">
                <IconeDoJogo icone={obterIconeDoProduto(oferta.produto)} alternativa={oferta.nome.slice(0, 1)} />
              </div>
              <div className="item-cartaoCorpo">
                 <h3>{oferta.nome}</h3>
                <p className="atenuado">
                  {oferta.produto.tipo === "equipamento"
                    ? `Equipamento · ${oferta.produto.espaco}`
                    : `${oferta.produto.quantidade} unidade(s)`}
                </p>
                <div className="informacao-linhaDeDados"><span>Preço</span><strong>{oferta.preco} moedas</strong></div>
                <p className="atenuado">Você possui {possuido}. {podePagar ? `Saldo após compra: ${partida.personagem.ouro - oferta.preco} moedas.` : ''}</p>
                {!podePagar ? <p className="informacao-alerta">Faltam {oferta.preco - partida.personagem.ouro} moedas.</p> : null}
                <Button
                  variant="primary"
                  size="sm"
                  disabled={ofertaEmCompra !== null || !podePagar}
                  loading={ofertaEmCompra === oferta.id}
                  aria-label={`Comprar ${oferta.nome} por ${oferta.preco} moedas`}
                  onClick={() => void comprar(oferta.id)}
                >
                  Comprar por {oferta.preco} moedas
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

