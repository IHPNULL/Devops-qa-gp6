import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ForumView from '../../src/views/ForumView.vue'
import * as api from '../../src/api/client.js'

/**
 * Aluno le, publica e responde no forum de um curso.
 *
 * Dado que estou autenticado e tenho acesso ao forum do curso, quando
 * acesso a aba de forum, entao vejo os posts existentes; quando publico
 * um post ou respondo um post existente, entao a nova publicacao aparece
 * listada.
 */
describe('Aluno interage no forum de um curso', () => {
  const postExistente = {
    id: 700,
    titulo: 'Duvida sobre fracoes',
    conteudo: 'Como somo 1/2 + 1/4?',
    autorNome: 'Bruno',
    respostas: [],
  }

  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(api, 'listarPosts').mockResolvedValue([postExistente])
  })

  it('Dado que o forum tem um post, Quando a tela carrega, Entao vejo o titulo e o autor', async () => {
    const wrapper = mount(ForumView, { props: { cursoId: 1 } })
    await flushPromises()

    expect(wrapper.text()).toContain('Duvida sobre fracoes')
    expect(wrapper.text()).toContain('Bruno')
  })

  it('Quando publico um novo post, Entao ele aparece na listagem', async () => {
    vi.spyOn(api, 'publicarPost').mockResolvedValue({
      id: 701,
      titulo: 'Outra duvida',
      conteudo: 'Conteudo',
      autorNome: 'Bruno',
      respostas: [],
    })

    const wrapper = mount(ForumView, { props: { cursoId: 1 } })
    await flushPromises()

    await wrapper.find('[data-testid="novo-post-titulo"]').setValue('Outra duvida')
    await wrapper.find('[data-testid="novo-post-conteudo"]').setValue('Conteudo')
    await wrapper.find('[data-testid="publicar-post"]').trigger('click')
    await flushPromises()

    expect(api.publicarPost).toHaveBeenCalledWith(1, 'Outra duvida', 'Conteudo')
    expect(wrapper.text()).toContain('Outra duvida')
  })

  it('Quando respondo um post, Entao a resposta e enviada para aquele post', async () => {
    vi.spyOn(api, 'responderPost').mockResolvedValue({
      id: 900,
      conteudo: 'E soma o numerador',
      autorNome: 'Bruno',
      dataHora: '2026-09-15T10:00:00',
    })

    const wrapper = mount(ForumView, { props: { cursoId: 1 } })
    await flushPromises()

    await wrapper.find('[data-testid="resposta-700"]').setValue('E soma o numerador')
    await wrapper.find('[data-testid="responder-700"]').trigger('click')
    await flushPromises()

    expect(api.responderPost).toHaveBeenCalledWith(700, 'E soma o numerador')
  })
})
