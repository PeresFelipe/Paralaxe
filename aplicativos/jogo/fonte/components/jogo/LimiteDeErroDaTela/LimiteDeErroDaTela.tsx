import { Component, type ReactNode } from 'react'
import { Button, Card } from '@/components/ui'

/** Isola falhas de renderização e de importação sem desmontar a coordenação da partida. */
export default class LimiteDeErroDaTela extends Component<
  { children: ReactNode }, { falhou: boolean }
> {
  state = { falhou: false }

  static getDerivedStateFromError() {
    return { falhou: true }
  }

  render() {
    if (!this.state.falhou) return this.props.children
    return (
      <Card as="section">
        <div role="alert">
          <h2>Não foi possível exibir esta tela</h2>
          <p>Escolha outra tela no menu ou recarregue o jogo para tentar novamente.</p>
        </div>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Recarregar jogo
        </Button>
      </Card>
    )
  }
}
