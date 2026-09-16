import { createRouter, createWebHistory } from 'vue-router'
import MissoesView from '../views/MissoesView.vue'
import NovaMissaoView from '../views/NovaMissaoView.vue'
import NotasView from '../views/NotasView.vue'
import ForumView from '../views/ForumView.vue'
import RankingView from '../views/RankingView.vue'
import PainelProfessorView from '../views/PainelProfessorView.vue'

/** Enquanto nao existe selecao de curso, toda tela trabalha sobre o curso 1. */
const CURSO_PADRAO = 1

/** Rotulos usados tambem no menu lateral (App.vue) e nos testes de UI. */
export const ITENS_DO_MENU = [
  { titulo: 'Missoes do aluno', caminho: '/missoes', icone: 'mdi-sword-cross' },
  { titulo: 'Nova missao (professor)', caminho: '/nova-missao', icone: 'mdi-plus-box' },
  { titulo: 'Minhas notas', caminho: '/notas', icone: 'mdi-clipboard-text' },
  { titulo: 'Forum', caminho: '/forum', icone: 'mdi-forum' },
  { titulo: 'Ranking da turma', caminho: '/ranking', icone: 'mdi-trophy' },
  { titulo: 'Painel do professor', caminho: '/painel-professor', icone: 'mdi-chart-box' },
]

const routes = [
  { path: '/', redirect: '/missoes' },
  { path: '/missoes', component: MissoesView, props: { cursoId: CURSO_PADRAO } },
  { path: '/nova-missao', component: NovaMissaoView, props: { cursoId: CURSO_PADRAO } },
  { path: '/notas', component: NotasView, props: { cursoId: CURSO_PADRAO } },
  { path: '/forum', component: ForumView, props: { cursoId: CURSO_PADRAO } },
  { path: '/ranking', component: RankingView, props: { cursoId: CURSO_PADRAO } },
  { path: '/painel-professor', component: PainelProfessorView, props: { cursoId: CURSO_PADRAO } },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
