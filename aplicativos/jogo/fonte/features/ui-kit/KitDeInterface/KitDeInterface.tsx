import { useState } from 'react'
import { Button, Card, Modal, ProgressBar, SelectField, TextField, type ButtonVariant } from '@/components/ui'
import styles from './KitDeInterface.module.css'

const variantes: ButtonVariant[] = [
  'primary', 'secondary', 'danger', 'ghost', 'profession', 'node', 'journey',
  'recipe', 'route', 'navigation', 'tab', 'hud', 'activity', 'location',
  'filter', 'inventory', 'creation', 'saveCard', 'icon',
]

export function KitDeInterface() {
  const [dialogoAberto, definirDialogoAberto] = useState(false)
  const [profissao, definirProfissao] = useState('mineracao')

  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Paralaxe · Ambiente de desenvolvimento</p>
          <h1>Kit de interface</h1>
          <p>Componentes compartilhados, variantes e estados. Use Tab para conferir o foco visível.</p>
        </div>
        <a className={styles.backLink} href="/">Voltar ao jogo</a>
      </header>

      <section className={styles.section} aria-labelledby="botoes-titulo">
        <h2 id="botoes-titulo">Botões</h2>
        <Card className={styles.card}>
          <h3>Variantes oficiais</h3>
          <div className={styles.buttonGrid}>
            {variantes.map((variant) => (
              <Button key={variant} variant={variant} onClick={() => undefined}>{variant}</Button>
            ))}
          </div>
          <h3>Tamanhos e estados</h3>
          <div className={styles.buttonGrid}>
            <Button size="sm">Pequeno</Button>
            <Button size="md">Médio</Button>
            <Button size="lg">Grande</Button>
            <Button disabled>Desabilitado</Button>
            <Button loading>Carregando</Button>
            <Button fullWidth variant="secondary">Largura total</Button>
          </div>
        </Card>
      </section>

      <section className={styles.section} aria-labelledby="campos-titulo">
        <h2 id="campos-titulo">Campos e seleção</h2>
        <div className={styles.grid}>
          <Card className={styles.card}>
            <h3>Texto e estados</h3>
            <TextField label="Nome do personagem" placeholder="Ex.: Aedan" description="Este nome aparece nas partidas locais." />
            <TextField label="Campo inválido" defaultValue="" error="Informe um nome para continuar." />
            <TextField label="Campo desabilitado" defaultValue="Somente leitura" disabled />
          </Card>
          <Card className={styles.card}>
            <h3>Seleção</h3>
            <SelectField label="Profissão" value={profissao} onChange={(evento) => definirProfissao(evento.target.value)}>
              <option value="mineracao">Mineração</option>
              <option value="pesca">Pesca</option>
              <option value="herbologia">Herbologia</option>
            </SelectField>
            <SelectField label="Seleção desabilitada" value="vazio" disabled>
              <option value="vazio">Nenhuma opção</option>
            </SelectField>
          </Card>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="paineis-titulo">
        <h2 id="paineis-titulo">Painéis, progresso e diálogo</h2>
        <div className={styles.grid}>
          <Card className={styles.card}>
            <h3>Progresso</h3>
            <ProgressBar label="Experiência do personagem" value={68} max={100} />
            <p>Experiência · 68 / 100</p>
          </Card>
          <Card className={styles.card}>
            <h3>Diálogo modal</h3>
            <p>Confere foco, Escape e retorno do foco ao controle que abriu o diálogo.</p>
            <Button onClick={() => definirDialogoAberto(true)}>Abrir diálogo</Button>
          </Card>
        </div>
      </section>

      {dialogoAberto ? (
        <Modal ariaLabel="Exemplo de diálogo" onClose={() => definirDialogoAberto(false)} className={styles.dialog}>
          <h2>Confirmação de exemplo</h2>
          <p>Este diálogo demonstra a superfície modal compartilhada.</p>
          <Button variant="secondary" onClick={() => definirDialogoAberto(false)}>Fechar</Button>
        </Modal>
      ) : null}
    </main>
  )
}
