import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import PainelProfessorView from '../../src/views/PainelProfessorView.vue'
import * as api from '../../src/api/client.js'

/**
 * Professor acompanha o desempenho da turma nas missoes de um curso.
 *
 * Dado que estou autenticado como professor responsavel pelo curso,
 * quando acesso o painel da turma, entao vejo XP, tentativas, acertos e
 * taxa de acerto de cada aluno matriculado.
 */
describe('Professor acompanha o desempenho da turma', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('Dado que ha alunos matriculados, Quando a tela carrega, Entao vejo o desempenho de cada um', async () => {
    vi.spyOn(api, 'buscarDesempenhoTurma').mockResolvedValue([
      { alunoId: 2, nome: 'Bruno', xpTotal: 10, tentativas: 2, acertos: 1, taxaAcerto: 0.5 },
      { alunoId: 3, nome: 'Carla', xpTotal: 0, tentativas: 0, acertos: 0, taxaAcerto: 0 },
    ])

    const wrapper = mount(PainelProfessorView, { props: { cursoId: 1 } })
    await flushPromises()

    expect(wrapper.text()).toContain('Bruno')
    expect(wrapper.text()).toContain('10')
    expect(wrapper.text()).toContain('Carla')
  })
})
