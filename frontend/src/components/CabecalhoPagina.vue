<script setup>
defineProps({
  titulo: { type: String, required: true },
  subtitulo: { type: String, default: '' },
  icone: { type: String, default: '' },
})
</script>

<template>
  <header class="d-flex align-center justify-space-between flex-wrap ga-4 mb-6">
    <div class="d-flex align-center ga-3">
      <v-avatar v-if="icone" color="surface-variant" size="44" rounded="lg">
        <v-icon :icon="icone" color="primary" />
      </v-avatar>
      <div>
        <h2 class="text-h5 font-weight-bold ge-titulo">{{ titulo }}</h2>
        <p v-if="subtitulo" class="text-body-2 text-medium-emphasis mt-1">{{ subtitulo }}</p>
      </div>
    </div>
    <slot name="acao" />
  </header>
</template>

<style scoped>
.ge-titulo {
  letter-spacing: -0.015em;
  line-height: 1.2;
}
</style>
