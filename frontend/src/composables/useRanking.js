import { ref } from 'vue'
import { buscarRanking, usuarioAtual } from '../api/client.js'

export function useRanking(cursoId) {
  const ranking = ref([])
  const carregando = ref(false)
  const erro = ref('')

  async function carregar() {
    carregando.value = true
    erro.value = ''
    try {
      ranking.value = await buscarRanking(cursoId)
    } catch (e) {
      erro.value = e.message
    } finally {
      carregando.value = false
    }
  }

  /** Destaca a linha do proprio aluno no ranking da turma. */
  function souEu(alunoId) {
    return usuarioAtual() === alunoId
  }

  return { ranking, carregando, erro, carregar, souEu }
}
