<script setup>
defineProps({
  icone: { type: String, default: 'mdi-inbox-outline' },
  mensagem: { type: String, required: true },
})
</script>

<template>
  <div class="text-center py-10 px-4">
    <v-avatar color="surface-variant" size="64" class="mb-4">
      <v-icon :icon="icone" size="32" color="primary" />
    </v-avatar>
    <p class="text-body-1 text-medium-emphasis">{{ mensagem }}</p>
  </div>
</template>
