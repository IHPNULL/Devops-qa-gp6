<script setup>
import { computed, onMounted } from 'vue'
import { useDesempenhoTurma } from '../composables/useDesempenhoTurma.js'
import CabecalhoPagina from '../components/CabecalhoPagina.vue'
import EstadoVazio from '../components/EstadoVazio.vue'

const props = defineProps({
  cursoId: { type: Number, required: true },
})

const { desempenho, carregando, erro, carregar } = useDesempenhoTurma(props.cursoId)

const xpDaTurma = computed(() => desempenho.value.reduce((total, a) => total + a.xpTotal, 0))

/** Abaixo de 50% de acerto o aluno aparece em vermelho: e quem precisa de ajuda. */
function cor(taxa) {
  if (taxa >= 0.75) return 'success'
  return taxa >= 0.5 ? 'warning' : 'error'
}

onMounted(carregar)
</script>

<template>
  <section>
    <CabecalhoPagina
      titulo="Desempenho da turma"
      subtitulo="Acompanhe quem esta avancando e quem precisa de ajuda"
      icone="mdi-chart-box"
    >
      <template #acao>
        <v-chip color="primary" variant="flat" size="large" prepend-icon="mdi-account-group">
          {{ desempenho.length }} alunos · {{ xpDaTurma }} XP
        </v-chip>
      </template>
    </CabecalhoPagina>

    <v-progress-linear v-if="carregando" color="primary" indeterminate rounded class="mb-4" />
    <v-alert v-if="erro" type="error" class="mb-4">{{ erro }}</v-alert>

    <v-card>
      <v-table v-if="desempenho.length" class="ge-tabela">
        <thead>
          <tr>
            <th>Aluno</th>
            <th class="text-right">XP</th>
            <th class="text-right">Tentativas</th>
            <th class="text-right">Acertos</th>
            <th class="text-right">Taxa de acerto</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="aluno in desempenho" :key="aluno.alunoId">
            <td>
              <div class="d-flex align-center ga-3 py-1">
                <v-avatar color="secondary" size="32">{{ aluno.nome.charAt(0) }}</v-avatar>
                <span class="font-weight-medium">{{ aluno.nome }}</span>
              </div>
            </td>
            <td class="text-right">{{ aluno.xpTotal }}</td>
            <td class="text-right">{{ aluno.tentativas }}</td>
            <td class="text-right">{{ aluno.acertos }}</td>
            <td class="text-right">
              <v-chip :color="cor(aluno.taxaAcerto)" variant="tonal" size="small">
                {{ Math.round(aluno.taxaAcerto * 100) }}%
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>

      <EstadoVazio
        v-else-if="!carregando && !erro"
        icone="mdi-account-group-outline"
        mensagem="Nenhum aluno matriculado neste curso ainda."
      />
    </v-card>
  </section>
</template>

<style scoped>
.ge-tabela :deep(thead th) {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.ge-tabela :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04);
}
</style>
