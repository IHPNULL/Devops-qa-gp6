import { ref } from 'vue'
import { listarMissoes, buscarProgresso, enviarResposta } from '../api/client.js'

export function useMissoes(cursoId) {
  const missoes = ref([])
  const xpTotal = ref(0)
  const resultados = ref({})
  const medalhasRecemConquistadas = ref([])
  const carregando = ref(false)
  const erro = ref('')

  async function carregar() {
    carregando.value = true
    erro.value = ''
    try {
      missoes.value = await listarMissoes(cursoId)
      const progresso = await buscarProgresso(cursoId)
      xpTotal.value = progresso.xpTotal
    } catch (e) {
      erro.value = e.message
    } finally {
      carregando.value = false
    }
  }

  async function responder(desafioId, indiceResposta) {
    erro.value = ''
    try {
      const resultado = await enviarResposta(desafioId, indiceResposta)
      resultados.value = { ...resultados.value, [desafioId]: resultado }
      xpTotal.value = resultado.xpTotalNoCurso
      medalhasRecemConquistadas.value = resultado.medalhasConquistadas ?? []
    } catch (e) {
      erro.value = e.message
    }
  }

  return {
    missoes,
    xpTotal,
    resultados,
    medalhasRecemConquistadas,
    carregando,
    erro,
    carregar,
    responder,
  }
}
