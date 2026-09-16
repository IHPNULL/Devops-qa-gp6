<script setup>
import { onMounted } from 'vue'
import { useMissoes } from '../composables/useMissoes.js'
import CabecalhoPagina from '../components/CabecalhoPagina.vue'
import EstadoVazio from '../components/EstadoVazio.vue'

const props = defineProps({
  cursoId: { type: Number, required: true },
})

const { missoes, xpTotal, resultados, medalhasRecemConquistadas, carregando, erro, carregar, responder } =
  useMissoes(props.cursoId)

onMounted(carregar)
</script>

<template>
  <section>
    <CabecalhoPagina
      titulo="Missoes do aluno"
      subtitulo="Responda os desafios da missao para ganhar XP"
      icone="mdi-sword-cross"
    >
      <template #acao>
        <v-chip color="primary" variant="flat" size="large" prepend-icon="mdi-lightning-bolt">
          XP total no curso: <strong data-testid="xp-total" class="ml-1">{{ xpTotal }}</strong>
        </v-chip>
      </template>
    </CabecalhoPagina>

    <div v-if="medalhasRecemConquistadas.length" class="d-flex flex-wrap ga-2 mb-6">
      <v-chip
        v-for="marco in medalhasRecemConquistadas"
        :key="marco"
        data-testid="nova-medalha"
        color="warning"
        variant="flat"
        size="large"
        prepend-icon="mdi-medal"
      >
        Nova medalha: {{ marco }} XP
      </v-chip>
    </div>

    <v-progress-linear v-if="carregando" color="primary" indeterminate rounded class="mb-4" />
    <v-alert v-if="erro" type="error" class="mb-4">{{ erro }}</v-alert>

    <v-card v-for="missao in missoes" :key="missao.id" class="mb-5">
      <v-card-item class="pb-2">
        <template #prepend>
          <v-avatar color="surface-variant" rounded="lg" size="40">
            <v-icon icon="mdi-flag-variant" color="primary" />
          </v-avatar>
        </template>
        <v-card-title class="text-wrap text-h6 font-weight-bold">{{ missao.titulo }}</v-card-title>
        <v-card-subtitle class="text-wrap">{{ missao.descricao }}</v-card-subtitle>
        <template #append>
          <v-chip color="primary" variant="tonal" size="small">{{ missao.xpTotal }} XP</v-chip>
        </template>
      </v-card-item>

      <v-divider class="mt-3" />

      <v-card-text>
        <div
          v-for="(desafio, i) in missao.desafios"
          :key="desafio.id"
          :class="['py-4', i < missao.desafios.length - 1 ? 'ge-separador' : '']"
        >
          <p class="text-body-1 font-weight-medium mb-3">{{ desafio.enunciado }}</p>

          <div class="d-flex flex-wrap ga-2">
            <v-btn
              v-for="(alternativa, indice) in desafio.alternativas"
              :key="indice"
              :data-testid="`alternativa-${desafio.id}-${indice}`"
              variant="outlined"
              size="large"
              @click="responder(desafio.id, indice)"
            >
              {{ alternativa }}
            </v-btn>
          </div>

          <v-alert
            v-if="resultados[desafio.id]"
            :type="resultados[desafio.id].correta ? 'success' : 'error'"
            density="compact"
            class="mt-4"
          >
            {{ resultados[desafio.id].correta ? 'Resposta correta' : 'Resposta incorreta' }}
            (+{{ resultados[desafio.id].xpGanho }} XP)
          </v-alert>
        </div>
      </v-card-text>
    </v-card>

    <v-card v-if="!carregando && !erro && missoes.length === 0">
      <EstadoVazio icone="mdi-flag-outline" mensagem="Ainda nao ha missoes publicadas neste curso." />
    </v-card>
  </section>
</template>

<style scoped>
.ge-separador {
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
</style>
