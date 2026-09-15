<script setup>
import { ref, onMounted } from 'vue'
import { listarNotas } from '../api/client.js'

const props = defineProps({
  cursoId: { type: Number, required: true },
})

const notas = ref([])

async function carregar() {
  notas.value = await listarNotas(props.cursoId)
}

onMounted(carregar)
</script>

<template>
  <section>
    <h2>Minhas notas</h2>
    <ul>
      <li v-for="nota in notas" :key="nota.id">
        {{ nota.avaliacao }}: {{ nota.valor }}
      </li>
    </ul>
  </section>
</template>
