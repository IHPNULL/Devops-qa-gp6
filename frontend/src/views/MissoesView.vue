<script setup>
import { ref, onMounted } from 'vue'
import { listarMissoes, buscarProgresso, enviarResposta } from '../api/client.js'

const props = defineProps({
  cursoId: { type: Number, required: true },
})

const missoes = ref([])
const xpTotal = ref(0)
const resultados = ref({})

async function carregar() {
  missoes.value = await listarMissoes(props.cursoId)
  const progresso = await buscarProgresso(props.cursoId)
  xpTotal.value = progresso.xpTotal
}

async function responder(desafioId, indiceResposta) {
  const resultado = await enviarResposta(desafioId, indiceResposta)
  resultados.value = { ...resultados.value, [desafioId]: resultado }
  xpTotal.value = resultado.xpTotalNoCurso
}

onMounted(carregar)
</script>

<template>
  <section>
    <p>XP total no curso: <strong data-testid="xp-total">{{ xpTotal }}</strong></p>

    <article v-for="missao in missoes" :key="missao.id">
      <h2>{{ missao.titulo }}</h2>
      <p>{{ missao.descricao }}</p>

      <div v-for="desafio in missao.desafios" :key="desafio.id">
        <p>{{ desafio.enunciado }}</p>
        <button
          v-for="(alternativa, indice) in desafio.alternativas"
          :key="indice"
          :data-testid="`alternativa-${desafio.id}-${indice}`"
          @click="responder(desafio.id, indice)"
        >
          {{ alternativa }}
        </button>

        <p v-if="resultados[desafio.id]">
          {{ resultados[desafio.id].correta ? 'Resposta correta' : 'Resposta incorreta' }}
          (+{{ resultados[desafio.id].xpGanho }} XP)
        </p>
      </div>
    </article>
  </section>
</template>
