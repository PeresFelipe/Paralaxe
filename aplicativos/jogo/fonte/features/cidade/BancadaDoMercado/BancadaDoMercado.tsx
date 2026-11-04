/**
 * @file Interface das compras no mercado PNJ.
 * Exibe as ofertas do catálogo e o saldo atual; a regra de compra no domínio calcula
 * a nova partida com débito e entrega, que é enviada ao callback de persistência.
 */
import { useState } from 'react'
import { OFERTAS_INICIAIS_DO_MERCADO_DE_PNJ } from '@paralaxe/conteudo'
import { obterUsoDeEspacosDoInventario, LIMITE_DE_ESPACOS_DO_INVENTARIO_V01, type PartidaLocal } from '@paralaxe/dominio'
import { Button, Card } from '@/components/ui'
import estilos from './BancadaDoMercado.module.css'

type PropriedadesDaTelaDeMercado = {
  partida: PartidaLocal
  aoComprarOferta: (idDaOferta: string) => Promise<void>
}

/** Mantém apenas mensagem e bloqueio de operação; os produtos e preços vêm do catálogo fixo. */
export default function BancadaDoMercado({ partida, aoComprarOferta }: PropriedadesDaTelaDeMercado) {
  const [mensagem, definirMensagem] = useState<string | null>(null)
  const [ocupado, definirOcupado] = useState(false)

  /** Resolve o ID da oferta, bloqueia reenvios durante a Promise e só anuncia sucesso depois de salvar. */
  async function comprar(ofertaId: string) {
    if (ocupado) return
    const oferta = OFERTAS_INICIAIS_DO_MERCADO_DE_PNJ.find((item) => item.id === ofertaId)
    if (!oferta) return

    definirOcupado(true)
    try {
      await aoComprarOferta(oferta.id)
      definirMensagem(`${oferta.nome} comprado por ${oferta.preco} moedas.`)
    } catch (erro) {
      definirMensagem(erro instanceof Error ? erro.message : 'Não foi possível concluir a compra.')
    } finally {
      definirOcupado(false)
    }
  }

  return (
    <section className="funcionalidade-telaDoJogo mercado-telaDoJogo" aria-labelledby="mercado-titulo">
      <div className="contexto-arte contexto-arte--compacto" aria-hidden="true">
        <span>ARTE 16:9 · MERCADO</span>
      </div>

      <div className="telaDoJogo-tituloDaSecao">
        <div>
          <p className="secao-chamada">Cidade · Mercado</p>
          <h2 id="mercado-titulo" className="destaque-titulo">Comprar</h2>
         </div>
        <div className="moedaCorrente-selo" aria-label={`${partida.personagem.ouro} moedas`}>
          <span aria-hidden="true">◇</span>
          <strong>{partida.personagem.ouro}</strong>
          <small>moedas</small>
        </div>
      </div>

      <p className="atenuado">Inventário: {obterUsoDeEspacosDoInventario(partida)} / {LIMITE_DE_ESPACOS_DO_INVENTARIO_V01} espaços. A compra entrega o item na bolsa.</p>
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
              <div className="item-miniatura" aria-hidden="true">{oferta.nome.slice(0, 1)}</div>
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
                  disabled={ocupado || !podePagar}
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

