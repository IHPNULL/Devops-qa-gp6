<script setup>
import { onMounted } from 'vue'
import { useMissoes } from '../composables/useMissoes.js'

const props = defineProps({
  cursoId: { type: Number, required: true },
})

const { missoes, xpTotal, resultados, medalhasRecemConquistadas, carregar, responder } = useMissoes(props.cursoId)

onMounted(carregar)
</script>

<template>
  <section>
    <p>XP total no curso: <strong data-testid="xp-total">{{ xpTotal }}</strong></p>

    <p v-for="marco in medalhasRecemConquistadas" :key="marco" data-testid="nova-medalha">
      Nova medalha: {{ marco }} XP
    </p>

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
