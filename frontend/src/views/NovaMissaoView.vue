<script setup>
import { useCriarMissao } from '../composables/useCriarMissao.js'
import DesafioForm from '../components/DesafioForm.vue'

const props = defineProps({
  cursoId: { type: Number, required: true },
})

const { missoes, form, salvar } = useCriarMissao(props.cursoId)
</script>

<template>
  <section>
    <h2>Nova missao</h2>

    <label>
      Titulo
      <input data-testid="titulo" v-model="form.titulo" />
    </label>
    <label>
      Descricao
      <input data-testid="descricao" v-model="form.descricao" />
    </label>

    <DesafioForm v-for="(desafio, i) in form.desafios" :key="i" v-model="form.desafios[i]" :index="i" />

    <button data-testid="salvar" @click="salvar">Salvar missao</button>

    <ul>
      <li v-for="missao in missoes" :key="missao.id">{{ missao.titulo }}</li>
    </ul>
  </section>
</template>
