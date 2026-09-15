<script setup>
import { ref } from 'vue'
import MissoesView from './views/MissoesView.vue'
import NovaMissaoView from './views/NovaMissaoView.vue'
import NotasView from './views/NotasView.vue'
import ForumView from './views/ForumView.vue'
import PainelProfessorView from './views/PainelProfessorView.vue'
import { usuarioAtual, definirUsuarioAtual } from './api/client.js'

const cursoId = ref(1)
const aba = ref('missoes')
const usuarioId = ref(usuarioAtual() ?? 1)

function salvarUsuario() {
  definirUsuarioAtual(usuarioId.value)
}
</script>

<template>
  <main>
    <h1>GameEducator</h1>

    <label>
      Usuario atual (X-Usuario-Id)
      <input type="number" v-model.number="usuarioId" @change="salvarUsuario" />
    </label>

    <nav>
      <button @click="aba = 'missoes'">Missoes do aluno</button>
      <button @click="aba = 'nova-missao'">Nova missao (professor)</button>
      <button @click="aba = 'notas'">Minhas notas</button>
      <button @click="aba = 'forum'">Forum</button>
      <button @click="aba = 'painel-professor'">Painel do professor</button>
    </nav>

    <MissoesView v-if="aba === 'missoes'" :curso-id="cursoId" />
    <NovaMissaoView v-else-if="aba === 'nova-missao'" :curso-id="cursoId" />
    <NotasView v-else-if="aba === 'notas'" :curso-id="cursoId" />
    <ForumView v-else-if="aba === 'forum'" :curso-id="cursoId" />
    <PainelProfessorView v-else :curso-id="cursoId" />
  </main>
</template>
