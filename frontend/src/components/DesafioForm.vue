<script setup>
import CampoTexto from './CampoTexto.vue'

defineProps({
  modelValue: { type: Object, required: true },
  index: { type: Number, required: true },
})
</script>

<template>
  <v-card class="mb-4" variant="outlined">
    <v-card-text>
      <div class="d-flex align-center ga-2 mb-4">
        <v-icon icon="mdi-help-circle-outline" color="primary" size="20" />
        <span class="text-subtitle-2 text-uppercase text-medium-emphasis ge-secao">
          Desafio {{ index + 1 }}
        </span>
      </div>

      <CampoTexto
        v-model="modelValue.enunciado"
        :testid="`desafio-${index}-enunciado`"
        label="Enunciado"
        class="mb-4"
      />

      <CampoTexto
        v-for="(alt, j) in modelValue.alternativas"
        :key="j"
        v-model="modelValue.alternativas[j]"
        :testid="`desafio-${index}-alternativa-${j}`"
        :label="`Alternativa ${j + 1}`"
        class="mb-4"
      />

      <v-row dense>
        <v-col cols="12" sm="6">
          <CampoTexto
            v-model="modelValue.indiceRespostaCorreta"
            :testid="`desafio-${index}-indiceCorreto`"
            label="Indice da alternativa correta"
            type="number"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <CampoTexto
            v-model="modelValue.xp"
            :testid="`desafio-${index}-xp`"
            label="XP"
            type="number"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.ge-secao {
  letter-spacing: 0.08em;
}
</style>
