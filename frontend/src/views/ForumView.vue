<script setup>
import { onMounted } from 'vue'
import { useForum } from '../composables/useForum.js'
import CampoTexto from '../components/CampoTexto.vue'
import CabecalhoPagina from '../components/CabecalhoPagina.vue'
import EstadoVazio from '../components/EstadoVazio.vue'

const props = defineProps({
  cursoId: { type: Number, required: true },
})

const { posts, novoPost, rascunhoResposta, carregando, erro, carregar, publicar, responder } =
  useForum(props.cursoId)

/** Iniciais do autor para o avatar da publicacao. */
function iniciais(nome) {
  return (nome ?? '?').trim().charAt(0).toUpperCase()
}

onMounted(carregar)
</script>

<template>
  <section>
    <CabecalhoPagina
      titulo="Forum"
      subtitulo="Tire duvidas e ajude os colegas do curso"
      icone="mdi-forum"
    />

    <v-card class="mb-6">
      <v-card-item class="pb-1">
        <v-card-title class="text-subtitle-1 font-weight-bold">Publicar no forum</v-card-title>
      </v-card-item>
      <v-card-text>
        <CampoTexto v-model="novoPost.titulo" testid="novo-post-titulo" label="Titulo" class="mb-4" />
        <CampoTexto
          v-model="novoPost.conteudo"
          testid="novo-post-conteudo"
          label="Conteudo"
          type="textarea"
        />
      </v-card-text>
      <v-card-actions class="px-4 pb-4 pt-0">
        <v-btn data-testid="publicar-post" variant="flat" prepend-icon="mdi-send" @click="publicar">
          Publicar
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-progress-linear v-if="carregando" color="primary" indeterminate rounded class="mb-4" />
    <v-alert v-if="erro" type="error" class="mb-4">{{ erro }}</v-alert>

    <v-card v-for="post in posts" :key="post.id" class="mb-4">
      <v-card-item class="pb-2">
        <template #prepend>
          <v-avatar color="secondary" size="40">{{ iniciais(post.autorNome) }}</v-avatar>
        </template>
        <v-card-title class="text-wrap text-h6 font-weight-bold">{{ post.titulo }}</v-card-title>
        <v-card-subtitle>{{ post.autorNome }}: {{ post.conteudo }}</v-card-subtitle>
      </v-card-item>

      <v-card-text>
        <div v-if="post.respostas.length" class="ge-respostas mb-4">
          <div v-for="resposta in post.respostas" :key="resposta.id" class="ge-resposta-item">
            <v-avatar color="primary" size="28" class="ge-resposta-avatar">
              {{ iniciais(resposta.autorNome) }}
            </v-avatar>
            <p class="ge-resposta-texto">
              <strong>{{ resposta.autorNome }}</strong>: {{ resposta.conteudo }}
            </p>
          </div>
        </div>

        <div class="d-flex align-center ga-3 flex-wrap">
          <CampoTexto
            v-model="rascunhoResposta[post.id]"
            :testid="`resposta-${post.id}`"
            label="Responder"
            class="flex-grow-1 ge-resposta"
          />
          <v-btn :data-testid="`responder-${post.id}`" variant="flat" @click="responder(post.id)">
            Responder
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <v-card v-if="!carregando && !erro && posts.length === 0">
      <EstadoVazio
        icone="mdi-forum-outline"
        mensagem="O forum deste curso ainda nao tem publicacoes."
      />
    </v-card>
  </section>
</template>

<style scoped>
.ge-resposta {
  min-width: 240px;
}

/* Respostas: texto escuro em cartao branco, com uma barra verde marcando a thread.
   Antes ficavam em texto de baixa enfase sobre o verde claro, praticamente ilegivel. */
.ge-respostas {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 12px;
  border-left: 3px solid rgb(var(--v-theme-primary));
}

.ge-resposta-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

.ge-resposta-avatar {
  flex: 0 0 auto;
  font-size: 0.75rem;
  font-weight: 700;
}

.ge-resposta-texto {
  margin: 0;
  color: rgb(var(--v-theme-on-surface));
  font-size: 0.95rem;
  line-height: 1.5;
}

.ge-resposta-texto strong {
  color: rgb(var(--v-theme-primary));
  font-weight: 700;
}
</style>
