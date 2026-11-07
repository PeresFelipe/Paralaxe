import type { DefinicaoDeClasseDoPersonagem, IdDaClasseDoPersonagem } from '@paralaxe/dominio'
import { Button } from '@/components/ui'
import estilos from './CartaoDaClasse.module.css'
/** Relaciona a classe ao arquivo servido por publico. Os caminhos da URL começam em /arte, sem o prefixo publico. */
const GIFS_DAS_CLASSES: Partial<Record<IdDaClasseDoPersonagem, string>> = {
  guerreiro: "/arte/classes/guerreiro/MattzArt/guerreiro.gif",
  mago: "/arte/classes/mago/LuizMelo/mago.gif",
};

const FOLHAS_DE_ANIMACAO_DAS_CLASSES: Partial<Record<IdDaClasseDoPersonagem, string>> = {
  cacador: "/arte/classes/cacador/Otsoga/joanna-idle-strip.png?v=2",
  acolito: "/arte/classes/acolito/tattuattor/acolito-idle.png",
  ladino: "/arte/classes/ladino/SpriteForge/ladino-idle.png",
  errante: "/arte/classes/errante/rvros/errante-idle.png",
};

export default function CartaoDaClasse({ definicao, selecionada, aoSelecionar }: {
  definicao: DefinicaoDeClasseDoPersonagem
  selecionada: boolean
  aoSelecionar: (id: IdDaClasseDoPersonagem) => void
}) {
  const gif = GIFS_DAS_CLASSES[definicao.id]
  const folha = FOLHAS_DE_ANIMACAO_DAS_CLASSES[definicao.id]
  return <Button variant="creation" data-with-art={gif || folha ? 'true' : 'false'}
    aria-pressed={selecionada} onClick={() => aoSelecionar(definicao.id)}>
    {folha ? <span className={estilos.sprite} data-classe={definicao.id} aria-hidden="true"
      style={{ backgroundImage: `url("${folha}")` }} /> : gif ?
      <img className={estilos.gif} src={gif} alt="" width={80} height={80} /> : null}
    <span className={estilos.texto}><strong>{definicao.nome}</strong><span>{definicao.resumo}</span></span>
  </Button>
}
