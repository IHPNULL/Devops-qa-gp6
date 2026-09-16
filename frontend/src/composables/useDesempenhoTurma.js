import { ref } from 'vue'
import { buscarDesempenhoTurma } from '../api/client.js'

export function useDesempenhoTurma(cursoId) {
  const desempenho = ref([])
  const carregando = ref(false)
  const erro = ref('')

  async function carregar() {
    carregando.value = true
    erro.value = ''
    try {
      desempenho.value = await buscarDesempenhoTurma(cursoId)
    } catch (e) {
      erro.value = e.message
    } finally {
      carregando.value = false
    }
  }

  return { desempenho, carregando, erro, carregar }
}
