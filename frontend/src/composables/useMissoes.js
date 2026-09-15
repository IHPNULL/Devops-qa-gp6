import { ref } from 'vue'
import { listarMissoes, buscarProgresso, enviarResposta } from '../api/client.js'

export function useMissoes(cursoId) {
  const missoes = ref([])
  const xpTotal = ref(0)
  const resultados = ref({})

  async function carregar() {
    missoes.value = await listarMissoes(cursoId)
    const progresso = await buscarProgresso(cursoId)
    xpTotal.value = progresso.xpTotal
  }

  async function responder(desafioId, indiceResposta) {
    const resultado = await enviarResposta(desafioId, indiceResposta)
    resultados.value = { ...resultados.value, [desafioId]: resultado }
    xpTotal.value = resultado.xpTotalNoCurso
  }

  return { missoes, xpTotal, resultados, carregar, responder }
}
