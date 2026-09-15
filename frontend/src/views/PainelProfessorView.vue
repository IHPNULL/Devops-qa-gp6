<script setup>
import { onMounted } from 'vue'
import { useDesempenhoTurma } from '../composables/useDesempenhoTurma.js'

const props = defineProps({
  cursoId: { type: Number, required: true },
})

const { desempenho, carregar } = useDesempenhoTurma(props.cursoId)

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
