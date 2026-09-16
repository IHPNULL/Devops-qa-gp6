import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RankingView from '../../src/views/RankingView.vue'
import * as api from '../../src/api/client.js'

/**
 * US - Aluno ve o ranking de XP da turma.
 *
 * Dado que estou autenticado como aluno e estou matriculado em um curso,
 * quando abro o ranking da turma, entao vejo os colegas ordenados por XP,
 * com a posicao de cada um, e a minha linha aparece destacada.
 */
describe('US: Aluno ve o ranking de XP da turma', () => {
  const ranking = [
    { posicao: 1, alunoId: 3, nomeAluno: 'Daniela', xpTotal: 25 },
    { posicao: 2, alunoId: 2, nomeAluno: 'Bruno', xpTotal: 10 },
  ]

  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('Dado o curso com XP acumulado, Quando abro o ranking, Entao vejo a turma ordenada com posicao e XP', async () => {
    vi.spyOn(api, 'buscarRanking').mockResolvedValue(ranking)

    const wrapper = mount(RankingView, { props: { cursoId: 1 } })
    await flushPromises()

    expect(api.buscarRanking).toHaveBeenCalledWith(1)

    const linhas = wrapper.findAll('[data-testid^="ranking-linha-"]')
    expect(linhas).toHaveLength(2)
    expect(linhas[0].text()).toContain('Daniela')
    expect(linhas[0].text()).toContain('25')
    expect(linhas[1].text()).toContain('Bruno')
    expect(linhas[1].text()).toContain('10')
  })

  it('Entao a minha linha no ranking aparece destacada', async () => {
    vi.spyOn(api, 'buscarRanking').mockResolvedValue(ranking)
    api.definirUsuarioAtual(2)

    const wrapper = mount(RankingView, { props: { cursoId: 1 } })
    await flushPromises()

    expect(wrapper.find('[data-testid="ranking-linha-2"]').classes()).toContain('ranking-eu')
    expect(wrapper.find('[data-testid="ranking-linha-3"]').classes()).not.toContain('ranking-eu')
  })

  it('Dado um curso sem XP acumulado, Quando abro o ranking, Entao vejo o aviso de ranking vazio', async () => {
    vi.spyOn(api, 'buscarRanking').mockResolvedValue([])

    const wrapper = mount(RankingView, { props: { cursoId: 1 } })
    await flushPromises()

    expect(wrapper.findAll('[data-testid^="ranking-linha-"]')).toHaveLength(0)
    expect(wrapper.text()).toContain('Ninguem pontuou neste curso ainda.')
  })

  it('Dado que a API falha, Quando abro o ranking, Entao a mensagem de erro e exibida', async () => {
    vi.spyOn(api, 'buscarRanking').mockRejectedValue(new Error('Curso nao encontrado(a): id=1'))

    const wrapper = mount(RankingView, { props: { cursoId: 1 } })
    await flushPromises()

    expect(wrapper.text()).toContain('Curso nao encontrado(a): id=1')
  })
})
