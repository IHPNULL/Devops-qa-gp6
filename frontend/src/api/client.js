const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export function usuarioAtual() {
  const raw = localStorage.getItem('gameeducator.usuarioId')
  return raw ? Number(raw) : null
}

export function definirUsuarioAtual(usuarioId) {
  localStorage.setItem('gameeducator.usuarioId', String(usuarioId))
}

async function request(path, { method = 'GET', body } = {}) {
  const usuarioId = usuarioAtual()
  const headers = { 'Content-Type': 'application/json' }
  if (usuarioId) {
    headers['X-Usuario-Id'] = String(usuarioId)
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const erro = await response.json().catch(() => ({ mensagem: response.statusText }))
    throw new Error(erro.mensagem ?? `Erro ${response.status}`)
  }

  if (response.status === 204) {
    return null
  }
  return response.json()
}

export function listarMissoes(cursoId) {
  return request(`/api/cursos/${cursoId}/missoes`)
}

export function criarMissao(cursoId, novaMissao) {
  return request(`/api/cursos/${cursoId}/missoes`, { method: 'POST', body: novaMissao })
}

export function enviarResposta(desafioId, indiceResposta) {
  return request(`/api/desafios/${desafioId}/respostas`, {
    method: 'POST',
    body: { indiceResposta },
  })
}

export function buscarProgresso(cursoId) {
  return request(`/api/cursos/${cursoId}/progresso`)
}

export function buscarRanking(cursoId) {
  return request(`/api/cursos/${cursoId}/ranking`)
}
