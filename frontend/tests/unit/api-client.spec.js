import { describe, it, expect, beforeEach, vi } from 'vitest'
import { listarMissoes, definirUsuarioAtual } from '../../src/api/client.js'

describe('api client', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('envia o header X-Usuario-Id quando ha um usuario definido', async () => {
    definirUsuarioAtual(42)
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }))

    await listarMissoes(1)

    const [, options] = fetchMock.mock.calls[0]
    expect(options.headers['X-Usuario-Id']).toBe('42')
  })

  it('lanca erro com a mensagem do backend quando a resposta nao e ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ mensagem: 'nao autorizado' }), { status: 403 }),
    )

    await expect(listarMissoes(1)).rejects.toThrow('nao autorizado')
  })
})
