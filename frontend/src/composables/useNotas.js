import { ref } from 'vue'
import { listarNotas } from '../api/client.js'

export function useNotas(cursoId) {
  const notas = ref([])

  async function carregar() {
    notas.value = await listarNotas(cursoId)
  }

  return { notas, carregar }
}
