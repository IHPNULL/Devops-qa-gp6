import { ref, reactive } from 'vue'
import { listarPosts, publicarPost, responderPost } from '../api/client.js'

export function useForum(cursoId) {
  const posts = ref([])
  const novoPost = reactive({ titulo: '', conteudo: '' })
  const rascunhoResposta = reactive({})
  const carregando = ref(false)
  const erro = ref('')

  async function carregar() {
    carregando.value = true
    erro.value = ''
    try {
      posts.value = await listarPosts(cursoId)
    } catch (e) {
      erro.value = e.message
    } finally {
      carregando.value = false
    }
  }

  async function publicar() {
    erro.value = ''
    try {
      const post = await publicarPost(cursoId, novoPost.titulo, novoPost.conteudo)
      posts.value = [post, ...posts.value]
      novoPost.titulo = ''
      novoPost.conteudo = ''
    } catch (e) {
      erro.value = e.message
    }
  }

  async function responder(postId) {
    erro.value = ''
    try {
      const resposta = await responderPost(postId, rascunhoResposta[postId])
      const post = posts.value.find((p) => p.id === postId)
      if (post) {
        post.respostas = [...post.respostas, resposta]
      }
      rascunhoResposta[postId] = ''
    } catch (e) {
      erro.value = e.message
    }
  }

  return { posts, novoPost, rascunhoResposta, carregando, erro, carregar, publicar, responder }
}
