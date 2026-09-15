<script setup>
defineProps({
  modelValue: { type: Object, required: true },
  index: { type: Number, required: true },
})
</script>

<template>
  <div>
    <label>
      Enunciado
      <input :data-testid="`desafio-${index}-enunciado`" v-model="modelValue.enunciado" />
    </label>
    <label v-for="(alt, j) in modelValue.alternativas" :key="j">
      Alternativa {{ j + 1 }}
      <input :data-testid="`desafio-${index}-alternativa-${j}`" v-model="modelValue.alternativas[j]" />
    </label>
    <label>
      Indice da alternativa correta
      <input
        :data-testid="`desafio-${index}-indiceCorreto`"
        type="number"
        v-model.number="modelValue.indiceRespostaCorreta"
      />
    </label>
    <label>
      XP
      <input :data-testid="`desafio-${index}-xp`" type="number" v-model.number="modelValue.xp" />
    </label>
  </div>
</template>
