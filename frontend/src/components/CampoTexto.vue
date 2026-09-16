<script setup>
import { computed } from 'vue'

/**
 * Campo de texto com visual Material (outlined + label flutuante).
 *
 * Usa <input>/<textarea> nativos de proposito: o Vuetify manda todo atributo
 * "data-*" para a div externa do v-text-field, e as suites de teste (Vitest e
 * Cucumber/Playwright) preenchem o campo pelo data-testid. Com o campo nativo,
 * o testid fica no proprio controle e o "fill"/"setValue" funciona.
 */
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, required: true },
  testid: { type: String, default: undefined },
  type: { type: String, default: 'text' },
  rows: { type: Number, default: 3 },
})

const emit = defineEmits(['update:modelValue', 'change'])

const multilinha = computed(() => props.type === 'textarea')

function aoDigitar(evento) {
  const valor = evento.target.value
  emit('update:modelValue', props.type === 'number' && valor !== '' ? Number(valor) : valor)
}
</script>

<template>
  <label class="ge-campo">
    <textarea
      v-if="multilinha"
      class="ge-campo__controle"
      :data-testid="testid"
      :rows="rows"
      :value="modelValue"
      placeholder=" "
      @input="aoDigitar"
      @change="emit('change', $event)"
    />
    <input
      v-else
      class="ge-campo__controle"
      :data-testid="testid"
      :type="type"
      :value="modelValue"
      placeholder=" "
      @input="aoDigitar"
      @change="emit('change', $event)"
    />
    <span class="ge-campo__label">{{ label }}</span>
  </label>
</template>

<style scoped>
.ge-campo {
  position: relative;
  display: block;
  width: 100%;
}

.ge-campo__controle {
  width: 100%;
  padding: 16px 14px;
  font: inherit;
  color: rgb(var(--v-theme-on-surface));
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.24);
  border-radius: 10px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.ge-campo__controle:hover {
  border-color: rgba(var(--v-theme-on-surface), 0.44);
}

.ge-campo__controle:focus {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.14);
}

textarea.ge-campo__controle {
  display: block;
  resize: vertical;
  min-height: 88px;
}

.ge-campo__label {
  position: absolute;
  top: 16px;
  left: 12px;
  padding: 0 4px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 1rem;
  line-height: 1;
  pointer-events: none;
  background-color: rgb(var(--v-theme-surface));
  transition: transform 0.15s ease, color 0.15s ease, font-size 0.15s ease;
  transform-origin: left top;
}

/* Sobe o label quando o campo tem foco ou conteudo (placeholder=" " permite o :placeholder-shown) */
.ge-campo__controle:focus ~ .ge-campo__label,
.ge-campo__controle:not(:placeholder-shown) ~ .ge-campo__label {
  transform: translateY(-23px) scale(0.78);
  color: rgb(var(--v-theme-primary));
}
</style>
