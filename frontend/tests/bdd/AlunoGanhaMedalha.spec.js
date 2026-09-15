import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import MissoesView from '../../src/views/MissoesView.vue'
import * as api from '../../src/api/client.js'

/**
 * Aluno ganha uma medalha ao atingir um marco de XP no curso.
 *
 * Dado que estou autenticado como aluno e respondo um desafio, quando a
 * resposta faz meu XP cruzar um marco (50, 100, 250 ou 500), entao a
 * tela mostra a nova medalha conquistada.
 */
describe('Aluno ganha medalha ao atingir marco de XP', () => {
  const missoes = [
    {
      id: 10,
      titulo: 'Missao de Boas-Vindas',
      descricao: 'Introducao ao curso',
      xpTotal: 50,
      desafios: [
        { id: 100, enunciado: '2 + 2 = ?', alternativas: ['3', '4', '5'], xp: 50 },
      ],
    },
  ]

  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(api, 'listarMissoes').mockResolvedValue(missoes)
    vi.spyOn(api, 'buscarProgresso').mockResolvedValue({ cursoId: 1, alunoId: 5, xpTotal: 0 })
  })

  it('Quando a resposta cruza o marco de 50 XP, Entao a tela mostra a medalha conquistada', async () => {
    vi.spyOn(api, 'enviarResposta').mockResolvedValue({
      correta: true,
      xpGanho: 50,
      xpTotalNoCurso: 50,
      medalhasConquistadas: [50],
    })

    const wrapper = mount(MissoesView, { props: { cursoId: 1 } })
    await flushPromises()

    await wrapper.find('[data-testid="alternativa-100-1"]').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Nova medalha: 50 XP')
  })

  it('Quando a resposta nao cruza nenhum marco, Entao nenhuma medalha nova e exibida', async () => {
    vi.spyOn(api, 'enviarResposta').mockResolvedValue({
      correta: true,
      xpGanho: 10,
      xpTotalNoCurso: 10,
      medalhasConquistadas: [],
    })

    const wrapper = mount(MissoesView, { props: { cursoId: 1 } })
    await flushPromises()

    await wrapper.find('[data-testid="alternativa-100-1"]').trigger('click')
    await flushPromises()

    expect(wrapper.text()).not.toContain('Nova medalha')
  })
})
