import { reactive, ref, onMounted } from 'vue'
import { listarMissoes, criarMissao } from '../api/client.js'

export function useCriarMissao(cursoId) {
  const missoes = ref([])

  const form = reactive({
    titulo: '',
    descricao: '',
    desafios: [{ enunciado: '', alternativas: ['', ''], indiceRespostaCorreta: 0, xp: 0 }],
  })

  async function carregar() {
    missoes.value = await listarMissoes(cursoId)
  }

  async function salvar() {
    const novaMissao = await criarMissao(cursoId, {
      titulo: form.titulo,
      descricao: form.descricao,
      desafios: form.desafios,
    })
    missoes.value = [...missoes.value, novaMissao]
  }

  onMounted(carregar)

  return { missoes, form, salvar }
}
