<script setup>
import { useCriarMissao } from '../composables/useCriarMissao.js'
import DesafioForm from '../components/DesafioForm.vue'
import CampoTexto from '../components/CampoTexto.vue'
import CabecalhoPagina from '../components/CabecalhoPagina.vue'

const props = defineProps({
  cursoId: { type: Number, required: true },
})

const { missoes, form, erro, salvando, salvar } = useCriarMissao(props.cursoId)
</script>

<template>
  <section>
    <CabecalhoPagina
      titulo="Nova missao"
      subtitulo="Publique uma missao com seus desafios para a turma"
      icone="mdi-plus-box"
    />

    <v-card class="mb-4">
      <v-card-text>
        <CampoTexto v-model="form.titulo" testid="titulo" label="Titulo" class="mb-4" />
        <CampoTexto v-model="form.descricao" testid="descricao" label="Descricao" type="textarea" />
      </v-card-text>
    </v-card>

    <DesafioForm v-for="(desafio, i) in form.desafios" :key="i" v-model="form.desafios[i]" :index="i" />

    <v-alert v-if="erro" type="error" class="mb-4">{{ erro }}</v-alert>

    <v-btn
      data-testid="salvar"
      variant="flat"
      size="large"
      prepend-icon="mdi-content-save"
      :loading="salvando"
      @click="salvar"
    >
      Salvar missao
    </v-btn>

    <v-card class="mt-8">
      <v-card-item class="pb-1">
        <v-card-title class="text-subtitle-1 font-weight-bold">Missoes do curso</v-card-title>
      </v-card-item>
      <v-divider class="mt-2" />
      <v-list density="comfortable" class="py-0">
        <v-list-item
          v-for="missao in missoes"
          :key="missao.id"
          :title="missao.titulo"
          prepend-icon="mdi-flag-variant"
        />
        <v-list-item v-if="missoes.length === 0" class="text-medium-emphasis">
          Nenhuma missao cadastrada ate agora.
        </v-list-item>
      </v-list>
    </v-card>
  </section>
</template>
