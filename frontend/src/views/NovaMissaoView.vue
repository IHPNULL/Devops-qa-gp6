<script setup>
import { reactive, ref, onMounted } from 'vue'
import { listarMissoes, criarMissao } from '../api/client.js'

const props = defineProps({
  cursoId: { type: Number, required: true },
})

const missoes = ref([])

const form = reactive({
  titulo: '',
  descricao: '',
  desafios: [{ enunciado: '', alternativas: ['', ''], indiceRespostaCorreta: 0, xp: 0 }],
})

async function carregar() {
  missoes.value = await listarMissoes(props.cursoId)
}

async function salvar() {
  const novaMissao = await criarMissao(props.cursoId, {
    titulo: form.titulo,
    descricao: form.descricao,
    desafios: form.desafios,
  })
  missoes.value = [...missoes.value, novaMissao]
}

onMounted(carregar)
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

    <div v-for="(desafio, i) in form.desafios" :key="i">
      <label>
        Enunciado
        <input :data-testid="`desafio-${i}-enunciado`" v-model="desafio.enunciado" />
      </label>
      <label v-for="(alt, j) in desafio.alternativas" :key="j">
        Alternativa {{ j + 1 }}
        <input :data-testid="`desafio-${i}-alternativa-${j}`" v-model="desafio.alternativas[j]" />
      </label>
      <label>
        Indice da alternativa correta
        <input
          :data-testid="`desafio-${i}-indiceCorreto`"
          type="number"
          v-model.number="desafio.indiceRespostaCorreta"
        />
      </label>
      <label>
        XP
        <input :data-testid="`desafio-${i}-xp`" type="number" v-model.number="desafio.xp" />
      </label>
    </div>

    <button data-testid="salvar" @click="salvar">Salvar missao</button>

    <ul>
      <li v-for="missao in missoes" :key="missao.id">{{ missao.titulo }}</li>
    </ul>
  </section>
</template>
