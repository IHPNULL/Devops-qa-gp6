package org.facens.grupo_6_gameeducator.service;

import java.util.List;
import org.facens.grupo_6_gameeducator.domain.Curso;
import org.facens.grupo_6_gameeducator.domain.Post;
import org.facens.grupo_6_gameeducator.domain.RespostaPost;
import org.facens.grupo_6_gameeducator.domain.Usuario;
import org.facens.grupo_6_gameeducator.exception.AcessoNegadoException;
import org.facens.grupo_6_gameeducator.exception.RecursoNaoEncontradoException;
import org.facens.grupo_6_gameeducator.exception.RegraDeNegocioException;
import org.facens.grupo_6_gameeducator.repository.CursoRepository;
import org.facens.grupo_6_gameeducator.repository.MatriculaRepository;
import org.facens.grupo_6_gameeducator.repository.PostRepository;
import org.facens.grupo_6_gameeducator.repository.RespostaPostRepository;
import org.facens.grupo_6_gameeducator.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Aba de foruns: "Como aluno, quero ter acesso aos foruns, para interagir e ajudar."
 *
 * <p>ETAPA GREEN do TDD: implementacao ingenua, apenas o suficiente para os
 * testes passarem. A busca de usuario/curso e a checagem de acesso estao
 * repetidas em listarPosts, publicar e responder.
 */
@Service
@Transactional
public class ForumService {

    private final UsuarioRepository usuarioRepository;
    private final CursoRepository cursoRepository;
    private final MatriculaRepository matriculaRepository;
    private final PostRepository postRepository;
    private final RespostaPostRepository respostaPostRepository;

    public ForumService(UsuarioRepository usuarioRepository,
                        CursoRepository cursoRepository,
                        MatriculaRepository matriculaRepository,
                        PostRepository postRepository,
                        RespostaPostRepository respostaPostRepository) {
        this.usuarioRepository = usuarioRepository;
        this.cursoRepository = cursoRepository;
        this.matriculaRepository = matriculaRepository;
        this.postRepository = postRepository;
        this.respostaPostRepository = respostaPostRepository;
    }

    @Transactional(readOnly = true)
    public List<Post> listarPosts(Long usuarioId, Long cursoId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> RecursoNaoEncontradoException.de("Usuario", usuarioId));
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> RecursoNaoEncontradoException.de("Curso", cursoId));
        if (!matriculaRepository.existsByCursoIdAndAlunoId(cursoId, usuarioId)
                && !curso.ehResponsavel(usuario)) {
            throw new AcessoNegadoException(
                    "Usuario " + usuarioId + " nao tem acesso ao forum do curso " + cursoId);
        }
        return postRepository.findByCursoIdOrderByDataHoraDescIdDesc(cursoId);
    }

    public Post publicar(Long usuarioId, Long cursoId, String titulo, String conteudo) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> RecursoNaoEncontradoException.de("Usuario", usuarioId));
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> RecursoNaoEncontradoException.de("Curso", cursoId));
        if (!matriculaRepository.existsByCursoIdAndAlunoId(cursoId, usuarioId)
                && !curso.ehResponsavel(usuario)) {
            throw new AcessoNegadoException(
                    "Usuario " + usuarioId + " nao tem acesso ao forum do curso " + cursoId);
        }
        if (titulo == null || titulo.isBlank()) {
            throw new RegraDeNegocioException("O post precisa de um titulo");
        }
        if (conteudo == null || conteudo.isBlank()) {
            throw new RegraDeNegocioException("O post precisa de um conteudo");
        }
        return postRepository.save(new Post(curso, usuario, titulo, conteudo));
    }

    public RespostaPost responder(Long usuarioId, Long postId, String conteudo) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> RecursoNaoEncontradoException.de("Post", postId));
        Long cursoId = post.getCurso().getId();
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> RecursoNaoEncontradoException.de("Usuario", usuarioId));
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> RecursoNaoEncontradoException.de("Curso", cursoId));
        if (!matriculaRepository.existsByCursoIdAndAlunoId(cursoId, usuarioId)
                && !curso.ehResponsavel(usuario)) {
            throw new AcessoNegadoException(
                    "Usuario " + usuarioId + " nao tem acesso ao forum do curso " + cursoId);
        }
        if (conteudo == null || conteudo.isBlank()) {
            throw new RegraDeNegocioException("A resposta precisa de um conteudo");
        }
        RespostaPost resposta = new RespostaPost(usuario, conteudo);
        post.adicionarResposta(resposta);
        return respostaPostRepository.save(resposta);
    }

    @Transactional(readOnly = true)
    public List<RespostaPost> respostasDo(Long postId) {
        return respostaPostRepository.findByPostIdOrderByIdAsc(postId);
    }
}
