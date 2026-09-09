import { describe, expect, it } from 'vitest'
import { BUILD_PHASE, BUILD_SAVE_MODE } from './index'

describe('Build 0.1 foundation', () => {
  it('keeps the first implementation phase local', () => {
    expect(BUILD_PHASE).toBe('phase-1-local')
    expect(BUILD_SAVE_MODE).toBe('OFFLINE')
  })
})
