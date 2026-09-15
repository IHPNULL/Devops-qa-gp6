import { ref } from 'vue'
import { buscarDesempenhoTurma } from '../api/client.js'

export function useDesempenhoTurma(cursoId) {
  const desempenho = ref([])

  async function carregar() {
    desempenho.value = await buscarDesempenhoTurma(cursoId)
  }

  return { desempenho, carregar }
}
