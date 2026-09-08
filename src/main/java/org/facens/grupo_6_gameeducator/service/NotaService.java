package org.facens.grupo_6_gameeducator.service;

import java.math.BigDecimal;
import java.util.List;
import org.facens.grupo_6_gameeducator.domain.Nota;
import org.facens.grupo_6_gameeducator.repository.CursoRepository;
import org.facens.grupo_6_gameeducator.repository.MatriculaRepository;
import org.facens.grupo_6_gameeducator.repository.NotaRepository;
import org.facens.grupo_6_gameeducator.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Aba de notas: "Como aluno, quero ver minhas notas de cada curso, para saber o meu progresso."
 *
 * <p>ETAPA RED do TDD: apenas os STUBS para o codigo compilar. Nenhuma regra
 * implementada ainda -> todos os testes de aceitacao e de unidade FALHAM.
 */
@Service
@Transactional
public class NotaService {

    private final UsuarioRepository usuarioRepository;
    private final CursoRepository cursoRepository;
    private final MatriculaRepository matriculaRepository;
    private final NotaRepository notaRepository;

    public NotaService(UsuarioRepository usuarioRepository,
                       CursoRepository cursoRepository,
                       MatriculaRepository matriculaRepository,
                       NotaRepository notaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.cursoRepository = cursoRepository;
        this.matriculaRepository = matriculaRepository;
        this.notaRepository = notaRepository;
    }

    /** STUB (RED) - ainda nao implementado. */
    @Transactional(readOnly = true)
    public List<Nota> minhasNotas(Long alunoId, Long cursoId) {
        throw new UnsupportedOperationException("TODO: implementar minhasNotas - etapa RED do TDD");
    }

    /** STUB (RED) - ainda nao implementado. */
    public Nota lancar(Long professorId, Long cursoId, Long alunoId, String avaliacao, BigDecimal valor) {
        throw new UnsupportedOperationException("TODO: implementar lancar - etapa RED do TDD");
    }
}
