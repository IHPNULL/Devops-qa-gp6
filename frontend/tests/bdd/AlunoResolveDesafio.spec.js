import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import MissoesView from '../../src/views/MissoesView.vue'
import * as api from '../../src/api/client.js'

/**
 * US01 - Aluno resolve um desafio de uma missao e recebe XP.
 *
 * Dado que estou autenticado como aluno e estou matriculado em um curso
 * que possui uma missao disponivel, quando clico no curso e na missao e
 * respondo o desafio, entao o sistema informa se a resposta esta correta,
 * eu recebo o XP do desafio quando acerto, e meu XP total do curso e
 * atualizado.
 */
describe('US01: Aluno resolve desafio e recebe XP', () => {
  const missoes = [
    {
      id: 10,
      titulo: 'Missao de Boas-Vindas',
      descricao: 'Introducao ao curso',
      xpTotal: 20,
      desafios: [
        { id: 100, enunciado: '2 + 2 = ?', alternativas: ['3', '4', '5'], xp: 20 },
      ],
    },
  ]

  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(api, 'listarMissoes').mockResolvedValue(missoes)
    vi.spyOn(api, 'buscarProgresso').mockResolvedValue({ cursoId: 1, alunoId: 5, xpTotal: 0 })
  })

  it('Dado o curso com uma missao disponivel, Quando a tela carrega, Entao a missao e seus desafios sao exibidos', async () => {
    const wrapper = mount(MissoesView, { props: { cursoId: 1 } })
    await flushPromises()

    expect(wrapper.text()).toContain('Missao de Boas-Vindas')
    expect(wrapper.text()).toContain('2 + 2 = ?')
  })

  it('Quando o aluno responde corretamente, Entao o sistema informa o acerto e credita o XP do desafio', async () => {
    vi.spyOn(api, 'enviarResposta').mockResolvedValue({
      correta: true,
      xpGanho: 20,
      xpTotalNoCurso: 20,
    })

    const wrapper = mount(MissoesView, { props: { cursoId: 1 } })
    await flushPromises()

    await wrapper.find('[data-testid="alternativa-100-1"]').trigger('click')
    await flushPromises()

    expect(api.enviarResposta).toHaveBeenCalledWith(100, 1)
    expect(wrapper.text()).toContain('Resposta correta')
    expect(wrapper.text()).toContain('+20 XP')
  })

  it('E o XP total do aluno no curso e atualizado apos a resposta', async () => {
    vi.spyOn(api, 'enviarResposta').mockResolvedValue({
      correta: true,
      xpGanho: 20,
      xpTotalNoCurso: 20,
    })

    const wrapper = mount(MissoesView, { props: { cursoId: 1 } })
    await flushPromises()

    expect(wrapper.find('[data-testid="xp-total"]').text()).toContain('0')

    await wrapper.find('[data-testid="alternativa-100-1"]').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="xp-total"]').text()).toContain('20')
  })
})
