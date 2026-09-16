<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { ITENS_DO_MENU } from './router/index.js'
import { usuarioAtual, definirUsuarioAtual } from './api/client.js'

const route = useRoute()
const router = useRouter()
const { mdAndUp } = useDisplay()

const menuAberto = ref(true)
const usuarioId = ref(usuarioAtual() ?? 1)

// O campo ja aparece preenchido: grava o valor exibido para que a primeira
// requisicao tambem leve o X-Usuario-Id, sem depender de um "change" do usuario.
if (usuarioAtual() === null) {
  definirUsuarioAtual(usuarioId.value)
}

function salvarUsuario() {
  definirUsuarioAtual(usuarioId.value)
}

function abrir(caminho) {
  router.push(caminho)
  if (!mdAndUp.value) {
    menuAberto.value = false
  }
}
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable" flat>
      <!-- color explicito: o default global de VBtn e "primary", que sumiria na barra verde -->
      <v-app-bar-nav-icon
        v-if="!mdAndUp"
        color="white"
        aria-label="Abrir menu"
        @click="menuAberto = !menuAberto"
      />
      <v-app-bar-title>
        <v-icon icon="mdi-school" class="mr-2" />
        GameEducator
      </v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="menuAberto"
      :permanent="mdAndUp"
      :temporary="!mdAndUp"
      color="surface"
      width="264"
    >
      <v-list nav density="comfortable" class="pa-2">
        <v-btn
          v-for="item in ITENS_DO_MENU"
          :key="item.caminho"
          :prepend-icon="item.icone"
          :active="route.path === item.caminho"
          :color="route.path === item.caminho ? 'primary' : 'on-surface'"
          variant="text"
          block
          class="justify-start mb-1 text-none text-body-1"
          @click="abrir(item.caminho)"
        >
          {{ item.titulo }}
        </v-btn>
      </v-list>

      <template #append>
        <v-divider />
        <div class="pa-4">
          <div class="d-flex align-center mb-2">
            <v-avatar color="secondary" size="32" class="mr-2">
              <v-icon icon="mdi-account" />
            </v-avatar>
            <span class="text-body-2">Usuario atual</span>
          </div>
          <v-text-field
            v-model.number="usuarioId"
            type="number"
            label="X-Usuario-Id"
            density="compact"
            @change="salvarUsuario"
          />
        </div>
      </template>
    </v-navigation-drawer>

    <v-main class="bg-background">
      <v-container class="py-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
