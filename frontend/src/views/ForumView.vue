<script setup>
import { onMounted } from 'vue'
import { useForum } from '../composables/useForum.js'

const props = defineProps({
  cursoId: { type: Number, required: true },
})

const { posts, novoPost, rascunhoResposta, carregar, publicar, responder } = useForum(props.cursoId)

onMounted(carregar)
</script>

<template>
  <section>
    <h2>Forum</h2>

    <label>
      Titulo
      <input data-testid="novo-post-titulo" v-model="novoPost.titulo" />
    </label>
    <label>
      Conteudo
      <input data-testid="novo-post-conteudo" v-model="novoPost.conteudo" />
    </label>
    <button data-testid="publicar-post" @click="publicar">Publicar</button>

    <article v-for="post in posts" :key="post.id">
      <h3>{{ post.titulo }}</h3>
      <p>{{ post.autorNome }}: {{ post.conteudo }}</p>

      <ul>
        <li v-for="resposta in post.respostas" :key="resposta.id">
          {{ resposta.autorNome }}: {{ resposta.conteudo }}
        </li>
      </ul>

      <input :data-testid="`resposta-${post.id}`" v-model="rascunhoResposta[post.id]" />
      <button :data-testid="`responder-${post.id}`" @click="responder(post.id)">Responder</button>
    </article>
  </section>
</template>
