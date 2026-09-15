import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import NovaMissaoView from '../../src/views/NovaMissaoView.vue'
import * as api from '../../src/api/client.js'

/**
 * US02 - Professor cria uma missao com desafios em um curso.
 *
 * Dado que estou autenticado como professor e sou responsavel por um
 * curso, quando acesso a aba de missoes e preencho o formulario de nova
 * missao com titulo e seus desafios, entao a missao e criada e listada
 * no curso, fica visivel para os alunos matriculados, e cada desafio
 * armazena o seu valor de XP.
 */
describe('US02: Professor cria missao com desafios', () => {
  const missaoCriada = {
    id: 99,
    titulo: 'Missao de Fracoes',
    descricao: 'Pratique fracoes',
    xpTotal: 15,
    desafios: [
      { id: 200, enunciado: '1/2 + 1/2 = ?', alternativas: ['1', '2', '0'], xp: 15 },
    ],
  }

  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(api, 'listarMissoes').mockResolvedValue([])
  })

  it('Dado que preencho titulo, descricao e um desafio, Quando salvo, Entao a missao e enviada com o XP do desafio', async () => {
    vi.spyOn(api, 'criarMissao').mockResolvedValue(missaoCriada)

    const wrapper = mount(NovaMissaoView, { props: { cursoId: 1 } })
    await flushPromises()

    await wrapper.find('[data-testid="titulo"]').setValue('Missao de Fracoes')
    await wrapper.find('[data-testid="descricao"]').setValue('Pratique fracoes')
    await wrapper.find('[data-testid="desafio-0-enunciado"]').setValue('1/2 + 1/2 = ?')
    await wrapper.find('[data-testid="desafio-0-alternativa-0"]').setValue('1')
    await wrapper.find('[data-testid="desafio-0-alternativa-1"]').setValue('2')
    await wrapper.find('[data-testid="desafio-0-indiceCorreto"]').setValue('1')
    await wrapper.find('[data-testid="desafio-0-xp"]').setValue('15')

    await wrapper.find('[data-testid="salvar"]').trigger('click')
    await flushPromises()

    expect(api.criarMissao).toHaveBeenCalledWith(1, {
      titulo: 'Missao de Fracoes',
      descricao: 'Pratique fracoes',
      desafios: [
        { enunciado: '1/2 + 1/2 = ?', alternativas: ['1', '2'], indiceRespostaCorreta: 1, xp: 15 },
      ],
    })
  })

  it('Entao a missao criada aparece listada no curso', async () => {
    vi.spyOn(api, 'criarMissao').mockResolvedValue(missaoCriada)

    const wrapper = mount(NovaMissaoView, { props: { cursoId: 1 } })
    await flushPromises()

    await wrapper.find('[data-testid="titulo"]').setValue('Missao de Fracoes')
    await wrapper.find('[data-testid="desafio-0-enunciado"]').setValue('1/2 + 1/2 = ?')
    await wrapper.find('[data-testid="desafio-0-alternativa-0"]').setValue('1')
    await wrapper.find('[data-testid="desafio-0-alternativa-1"]').setValue('2')
    await wrapper.find('[data-testid="desafio-0-indiceCorreto"]').setValue('1')
    await wrapper.find('[data-testid="desafio-0-xp"]').setValue('15')

    await wrapper.find('[data-testid="salvar"]').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Missao de Fracoes')
  })
})
