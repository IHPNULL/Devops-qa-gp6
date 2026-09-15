import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import NotasView from '../../src/views/NotasView.vue'
import * as api from '../../src/api/client.js'

/**
 * Aluno ve as proprias notas do curso.
 *
 * Dado que estou autenticado como aluno e estou matriculado em um curso,
 * quando acesso a aba de notas, entao vejo as minhas notas de cada
 * avaliacao lancada pelo professor.
 */
describe('Aluno ve as proprias notas do curso', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('Dado que tenho notas lancadas, Quando a tela carrega, Entao vejo avaliacao e valor de cada nota', async () => {
    vi.spyOn(api, 'listarNotas').mockResolvedValue([
      { id: 1, avaliacao: 'Prova 1', valor: 8.5 },
      { id: 2, avaliacao: 'Trabalho Final', valor: 9.0 },
    ])

    const wrapper = mount(NotasView, { props: { cursoId: 1 } })
    await flushPromises()

    expect(wrapper.text()).toContain('Prova 1')
    expect(wrapper.text()).toContain('8.5')
    expect(wrapper.text()).toContain('Trabalho Final')
    expect(wrapper.text()).toContain('9')
  })
})
