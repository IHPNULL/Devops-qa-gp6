<script setup>
import { onMounted } from 'vue'
import { useRanking } from '../composables/useRanking.js'

const props = defineProps({
  cursoId: { type: Number, required: true },
})

const { ranking, carregando, erro, carregar, souEu } = useRanking(props.cursoId)

/** Medalha de destaque para os tres primeiros colocados. */
const CORES_DO_PODIO = { 1: 'warning', 2: 'secondary', 3: 'info' }

onMounted(carregar)
</script>

<template>
  <section>
    <h2 class="text-h5 mb-4">Ranking da turma</h2>

    <v-progress-linear v-if="carregando" color="primary" indeterminate class="mb-4" />
    <v-alert v-if="erro" type="error" variant="tonal" class="mb-4">{{ erro }}</v-alert>

    <v-card>
      <v-list density="comfortable">
        <v-list-item
          v-for="item in ranking"
          :key="item.alunoId"
          :data-testid="`ranking-linha-${item.alunoId}`"
          :class="{ 'ranking-eu': souEu(item.alunoId) }"
        >
          <template #prepend>
            <v-avatar
              :color="CORES_DO_PODIO[item.posicao] ?? 'surface-variant'"
              size="36"
              class="mr-3 font-weight-bold"
            >
              <v-icon v-if="item.posicao <= 3" icon="mdi-medal" />
              <span v-else>{{ item.posicao }}</span>
            </v-avatar>
          </template>

          <v-list-item-title>
            {{ item.posicao }}. {{ item.nomeAluno }}
            <v-chip v-if="souEu(item.alunoId)" size="x-small" color="primary" class="ml-2">voce</v-chip>
          </v-list-item-title>

          <template #append>
            <v-chip color="primary" variant="tonal" prepend-icon="mdi-lightning-bolt">
              {{ item.xpTotal }} XP
            </v-chip>
          </template>
        </v-list-item>

        <v-list-item v-if="!carregando && !erro && ranking.length === 0">
          Ninguem pontuou neste curso ainda.
        </v-list-item>
      </v-list>
    </v-card>
  </section>
</template>

<style scoped>
.ranking-eu {
  background-color: rgb(var(--v-theme-surface-variant));
}
</style>
