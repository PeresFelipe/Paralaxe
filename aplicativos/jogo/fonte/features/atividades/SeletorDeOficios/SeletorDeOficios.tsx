/** Seletor dos ofícios; acessibilidade e posicionamento controlados pelo Radix Select. */
import * as Selecao from '@radix-ui/react-select'
import type { IdDaProfissao, PartidaLocal } from '@paralaxe/dominio'
import { IconeDoJogo } from '@/components/jogo'
import { iconeDeProfissaoPorId } from '@/iconesDosRecursos'
import { coletaProfissoes, producaoProfissoes, rotulosDasProfissoes } from '@/rotulosDoJogo'
import estilos from './SeletorDeOficios.module.css'

type Propriedades = {
  selecionado: IdDaProfissao
  profissoes: PartidaLocal['profissoes']
  emCurso?: IdDaProfissao
  aoSelecionar: (id: IdDaProfissao) => void
}

const grupos = [
  { titulo: 'Coleta', profissoes: coletaProfissoes },
  { titulo: 'Produção', profissoes: producaoProfissoes },
] as const

export function SeletorDeOficios({ selecionado, profissoes, emCurso, aoSelecionar }: Propriedades) {
  const nomeSelecionado = rotulosDasProfissoes[selecionado]
  return (
    <div className={estilos.raiz}>
      <span className={estilos.rotulo}>Escolher ofício</span>
      <Selecao.Root value={selecionado} onValueChange={(valor) => aoSelecionar(valor as IdDaProfissao)}>
        <Selecao.Trigger className={estilos.gatilho} aria-label="Escolher ofício">
          <span className={estilos.icone} aria-hidden="true">
            <IconeDoJogo icone={iconeDeProfissaoPorId[selecionado]} tamanho={32} />
          </span>
          <span className={estilos.dados}>
            <span className={estilos.nome}><Selecao.Value>{nomeSelecionado}</Selecao.Value></span>
            <span className={estilos.subtitulo}>Nível {profissoes[selecionado].nivel}</span>
          </span>
          {emCurso === selecionado ? <span className={estilos.selo}>Em curso</span> : null}
          <Selecao.Icon className={estilos.seta} aria-hidden="true">⌄</Selecao.Icon>
        </Selecao.Trigger>
        <Selecao.Portal>
          <Selecao.Content
            className={estilos.menu}
            position="popper"
            side="bottom"
            align="start"
            sideOffset={8}
            collisionPadding={12}
            avoidCollisions
          >
            <Selecao.ScrollUpButton className={estilos.rolagem}>⌃</Selecao.ScrollUpButton>
            <Selecao.Viewport className={estilos.lista}>
              {grupos.map((grupo, indice) => (
                <Selecao.Group key={grupo.titulo}>
                  {indice > 0 ? <Selecao.Separator className={estilos.divisor} /> : null}
                  <Selecao.Label className={estilos.categoria}>{grupo.titulo}</Selecao.Label>
                  {grupo.profissoes.map((profissao) => (
                    <Selecao.Item key={profissao} value={profissao} textValue={rotulosDasProfissoes[profissao]} className={estilos.item}>
                      <span className={estilos.iconeItem} aria-hidden="true">
                        <IconeDoJogo icone={iconeDeProfissaoPorId[profissao]} tamanho={30} />
                      </span>
                      <span className={estilos.itemDados}>
                        <Selecao.ItemText>{rotulosDasProfissoes[profissao]}</Selecao.ItemText>
                        <small>Nível {profissoes[profissao].nivel}</small>
                      </span>
                      {emCurso === profissao ? <span className={estilos.emCurso}>Em curso</span> : null}
                      <Selecao.ItemIndicator className={estilos.indicador} aria-hidden="true">✓</Selecao.ItemIndicator>
                    </Selecao.Item>
                  ))}
                </Selecao.Group>
              ))}
            </Selecao.Viewport>
            <Selecao.ScrollDownButton className={estilos.rolagem}>⌄</Selecao.ScrollDownButton>
          </Selecao.Content>
        </Selecao.Portal>
      </Selecao.Root>
    </div>
  )
}
