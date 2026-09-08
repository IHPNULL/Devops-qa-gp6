package org.facens.grupo_6_gameeducator.service;

import java.util.List;
import org.facens.grupo_6_gameeducator.domain.Post;
import org.facens.grupo_6_gameeducator.domain.RespostaPost;
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
 * <p>ETAPA RED do TDD: apenas os STUBS para o codigo compilar. Nenhuma regra
 * implementada ainda -> todos os testes de aceitacao e de unidade FALHAM.
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

    /** STUB (RED) - ainda nao implementado. */
    @Transactional(readOnly = true)
    public List<Post> listarPosts(Long usuarioId, Long cursoId) {
        throw new UnsupportedOperationException("TODO: implementar listarPosts - etapa RED do TDD");
    }

    /** STUB (RED) - ainda nao implementado. */
    public Post publicar(Long usuarioId, Long cursoId, String titulo, String conteudo) {
        throw new UnsupportedOperationException("TODO: implementar publicar - etapa RED do TDD");
    }

    /** STUB (RED) - ainda nao implementado. */
    public RespostaPost responder(Long usuarioId, Long postId, String conteudo) {
        throw new UnsupportedOperationException("TODO: implementar responder - etapa RED do TDD");
    }

    /** STUB (RED) - ainda nao implementado. */
    @Transactional(readOnly = true)
    public List<RespostaPost> respostasDo(Long postId) {
        throw new UnsupportedOperationException("TODO: implementar respostasDo - etapa RED do TDD");
    }
}
