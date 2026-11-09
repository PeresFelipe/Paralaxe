import { useEffect, useRef, useState } from 'react'
import type { DefinicaoDeSalaDaMasmorra } from '@paralaxe/dominio'
import type Phaser from 'phaser'
import { AssetGenerator, TILE_SIZE } from '@/terceiros/dungeonCrawlerNow/AssetGenerator'
import type { DungeonData, Room } from '@/terceiros/dungeonCrawlerNow/DungeonGenerator'
import { createDungeonTiles } from '@/terceiros/dungeonCrawlerNow/createDungeonTiles'
import estilos from './CenaDaMasmorra.module.css'

export default function PalcoDaMasmorra({ geometria, sala, resolvida }: {
  geometria: { dungeon: DungeonData; room: Room }
  sala: DefinicaoDeSalaDaMasmorra
  resolvida: boolean
}) {
  const palco = useRef<HTMLDivElement>(null)
  const [falhou, definirFalhou] = useState(false)
  const encontro = useRef<Phaser.GameObjects.Sprite | null>(null)
  const resolvidaAtual = useRef(resolvida)
  useEffect(() => {
    resolvidaAtual.current = resolvida
    const sprite = encontro.current
    if (!sprite) return
    if (sala.tipo === 'tesouro') sprite.setTexture(resolvida ? 'chest_open' : 'chest_closed')
    else sprite.setVisible(!resolvida)
  }, [resolvida, sala.tipo])

  useEffect(() => {
    const parent = palco.current
    if (!parent) return
    let cancelado = false
    let jogo: Phaser.Game | undefined
    void import('phaser').then(({ default: motor }) => {
      if (cancelado) return
      const { dungeon, room } = geometria
      const largura = (room.width + 2) * TILE_SIZE
      const altura = (room.height + 2) * TILE_SIZE
      jogo = new motor.Game({
        type: motor.CANVAS,
        parent,
        width: largura,
        height: altura,
        backgroundColor: '#141820',
        pixelArt: true,
        audio: { noAudio: true },
        input: { keyboard: false, mouse: false, touch: false, gamepad: false },
        banner: false,
        scene: {
          create(this: Phaser.Scene) {
            const assets = new AssetGenerator(this)
            assets.createPlayerAssets()
            assets.createFloorAndWallAssets()
            assets.createEnemyAssets()
            assets.createSpecialRoomObjectAssets()
            createDungeonTiles(this, dungeon, room)
            this.cameras.main.setScroll((room.x - 1) * TILE_SIZE, (room.y - 1) * TILE_SIZE)
            const x = (room.x + room.width / 2) * TILE_SIZE
            const y = (room.y + room.height / 2) * TILE_SIZE
            this.add.sprite(x - 2 * TILE_SIZE, y, 'player').setDepth(1)
            const textura = sala.idDaDefinicaoDoInimigo
              ? (sala.tipo === 'chefe' ? 'enemy_boss' : 'enemy')
              : sala.tipo === 'recuperacao' ? 'shrine'
              : sala.tipo === 'tesouro' ? (resolvidaAtual.current ? 'chest_open' : 'chest_closed')
              : null
            if (textura) {
              encontro.current = this.add.sprite(x + 2 * TILE_SIZE, y, textura).setDepth(1)
              encontro.current.setVisible(sala.tipo === 'tesouro' || !resolvidaAtual.current)
            }
          },
        },
      })
    }).catch(() => { if (!cancelado) definirFalhou(true) })
    return () => {
      cancelado = true
      encontro.current = null
      if (jogo) {
        jogo.destroy(true)
      }
    }
  }, [geometria, sala])

  return <>
    <div ref={palco} className={estilos.palcoOriginal} role="img" aria-label={`Cena 2D de ${sala.nome}`} />
    {falhou && <p role="status">Não foi possível abrir a cena. As ações da sala continuam disponíveis.</p>}
  </>
}
