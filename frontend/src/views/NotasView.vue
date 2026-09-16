<script setup>
import { computed, onMounted } from 'vue'
import { useNotas } from '../composables/useNotas.js'
import CabecalhoPagina from '../components/CabecalhoPagina.vue'
import EstadoVazio from '../components/EstadoVazio.vue'

const props = defineProps({
  cursoId: { type: Number, required: true },
})

const { notas, carregando, erro, carregar } = useNotas(props.cursoId)

const media = computed(() => {
  if (notas.value.length === 0) return null
  const soma = notas.value.reduce((total, nota) => total + Number(nota.valor), 0)
  return (soma / notas.value.length).toFixed(2)
})

/** Verde a partir de 6.0 (aprovado), vermelho abaixo disso. */
function cor(valor) {
  return Number(valor) >= 6 ? 'success' : 'error'
}

onMounted(carregar)
</script>

<template>
  <section>
    <CabecalhoPagina
      titulo="Minhas notas"
      subtitulo="Suas avaliacoes neste curso"
      icone="mdi-clipboard-text"
    >
      <template #acao>
        <v-chip v-if="media" color="primary" variant="flat" size="large" prepend-icon="mdi-calculator">
          Media: {{ media }}
        </v-chip>
      </template>
    </CabecalhoPagina>

    <v-progress-linear v-if="carregando" color="primary" indeterminate rounded class="mb-4" />
    <v-alert v-if="erro" type="error" class="mb-4">{{ erro }}</v-alert>

    <v-card>
      <v-list v-if="notas.length" density="comfortable" class="py-0">
        <template v-for="(nota, i) in notas" :key="nota.id">
          <v-divider v-if="i > 0" />
          <v-list-item class="py-3">
            <template #prepend>
              <v-avatar color="surface-variant" rounded="lg" size="40" class="mr-1">
                <v-icon icon="mdi-clipboard-check-outline" color="primary" />
              </v-avatar>
            </template>
            <v-list-item-title class="font-weight-medium">
              {{ nota.avaliacao }}: {{ nota.valor }}
            </v-list-item-title>
            <template #append>
              <v-chip :color="cor(nota.valor)" variant="tonal" size="small">{{ nota.valor }}</v-chip>
            </template>
          </v-list-item>
        </template>
      </v-list>

      <EstadoVazio
        v-else-if="!carregando && !erro"
        icone="mdi-clipboard-outline"
        mensagem="Nenhuma avaliacao lancada ate agora."
      />
    </v-card>
  </section>
</template>
