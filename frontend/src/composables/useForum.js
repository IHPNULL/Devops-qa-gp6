import { ref, reactive } from 'vue'
import { listarPosts, publicarPost, responderPost } from '../api/client.js'

export function useForum(cursoId) {
  const posts = ref([])
  const novoPost = reactive({ titulo: '', conteudo: '' })
  const rascunhoResposta = reactive({})

  async function carregar() {
    posts.value = await listarPosts(cursoId)
  }

  async function publicar() {
    const post = await publicarPost(cursoId, novoPost.titulo, novoPost.conteudo)
    posts.value = [post, ...posts.value]
    novoPost.titulo = ''
    novoPost.conteudo = ''
  }

  async function responder(postId) {
    const resposta = await responderPost(postId, rascunhoResposta[postId])
    const post = posts.value.find((p) => p.id === postId)
    if (post) {
      post.respostas = [...post.respostas, resposta]
    }
    rascunhoResposta[postId] = ''
  }

  return { posts, novoPost, rascunhoResposta, carregar, publicar, responder }
}
