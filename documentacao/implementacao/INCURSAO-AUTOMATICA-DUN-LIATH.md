# Incursão Automática de Dún Liath — integração local

Referência: GDD §23. Implementação na branch `develop`.

- Liberada após concluir a Dún Liath Fácil. Não é uma quinta dificuldade.
- Presets de balanceamento provisório: Cautelosa (15min, 82%, 1 Viga), Equilibrada (30min, 67%, 2 Vigas), Ousada (60min, 52%, 3 Vigas).
- Bônus calculado do nível do personagem até 12 p.p., chance total máxima de 94%.
- Não explora salas nem concede Relíquias, segredos, documentos ou espólios exclusivos de Fairtheoir.
- Estado salvo com início, término, semente, chance e recompensa possível; conclusão consulta o relógio, sem consumir múltiplos intervalos.
- Resgate credita os itens e apaga o plano ativo na mesma transição. Repetição é rejeitada.
- Inventário cheio mantém a incursão concluída pendente, permitindo cancelar sem recompensa para liberar o personagem.
- As atividades de Ofício são pausadas e retomadas com relógios deslocados; reabrir o navegador não gera produção paralela.
- Save v17: migração de v16 e anteriores, sem alterar a versão física ou nome do IndexedDB.

Limites: não há execução de múltiplas incursões em fila nem servidor autoritativo; valores exigem balanceamento futuro.
