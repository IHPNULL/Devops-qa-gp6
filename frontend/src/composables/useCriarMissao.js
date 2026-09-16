import { reactive, ref, onMounted } from 'vue'
import { listarMissoes, criarMissao } from '../api/client.js'

export function useCriarMissao(cursoId) {
  const missoes = ref([])
  const salvando = ref(false)
  const erro = ref('')

  const form = reactive({
    titulo: '',
    descricao: '',
    desafios: [{ enunciado: '', alternativas: ['', ''], indiceRespostaCorreta: 0, xp: 0 }],
  })

  async function carregar() {
    erro.value = ''
    try {
      missoes.value = await listarMissoes(cursoId)
    } catch (e) {
      erro.value = e.message
    }
  }

  async function salvar() {
    salvando.value = true
    erro.value = ''
    try {
      const novaMissao = await criarMissao(cursoId, {
        titulo: form.titulo,
        descricao: form.descricao,
        desafios: form.desafios,
      })
      missoes.value = [...missoes.value, novaMissao]
    } catch (e) {
      erro.value = e.message
    } finally {
      salvando.value = false
    }
  }

  onMounted(carregar)

  return { missoes, form, salvando, erro, salvar }
}
