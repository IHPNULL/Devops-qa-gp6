import { ref } from 'vue'
import { listarNotas } from '../api/client.js'

export function useNotas(cursoId) {
  const notas = ref([])
  const carregando = ref(false)
  const erro = ref('')

  async function carregar() {
    carregando.value = true
    erro.value = ''
    try {
      notas.value = await listarNotas(cursoId)
    } catch (e) {
      erro.value = e.message
    } finally {
      carregando.value = false
    }
  }

  return { notas, carregando, erro, carregar }
}
