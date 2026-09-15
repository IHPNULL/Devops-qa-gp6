<script setup>
import { onMounted } from 'vue'
import { useNotas } from '../composables/useNotas.js'

const props = defineProps({
  cursoId: { type: Number, required: true },
})

const { notas, carregar } = useNotas(props.cursoId)

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
