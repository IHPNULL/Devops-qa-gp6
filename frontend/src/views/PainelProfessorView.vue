<script setup>
import { ref, onMounted } from 'vue'
import { buscarDesempenhoTurma } from '../api/client.js'

const props = defineProps({
  cursoId: { type: Number, required: true },
})

const desempenho = ref([])

async function carregar() {
  desempenho.value = await buscarDesempenhoTurma(props.cursoId)
}

onMounted(carregar)
</script>

<template>
  <section>
    <h2>Desempenho da turma</h2>
    <table>
      <thead>
        <tr>
          <th>Aluno</th>
          <th>XP</th>
          <th>Tentativas</th>
          <th>Acertos</th>
          <th>Taxa de acerto</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="aluno in desempenho" :key="aluno.alunoId">
          <td>{{ aluno.nome }}</td>
          <td>{{ aluno.xpTotal }}</td>
          <td>{{ aluno.tentativas }}</td>
          <td>{{ aluno.acertos }}</td>
          <td>{{ Math.round(aluno.taxaAcerto * 100) }}%</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
