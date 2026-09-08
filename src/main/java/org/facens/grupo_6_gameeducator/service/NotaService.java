package org.facens.grupo_6_gameeducator.service;

import java.math.BigDecimal;
import java.util.List;
import org.facens.grupo_6_gameeducator.domain.Curso;
import org.facens.grupo_6_gameeducator.domain.Nota;
import org.facens.grupo_6_gameeducator.domain.Usuario;
import org.facens.grupo_6_gameeducator.exception.AcessoNegadoException;
import org.facens.grupo_6_gameeducator.exception.RecursoNaoEncontradoException;
import org.facens.grupo_6_gameeducator.exception.RegraDeNegocioException;
import org.facens.grupo_6_gameeducator.repository.CursoRepository;
import org.facens.grupo_6_gameeducator.repository.MatriculaRepository;
import org.facens.grupo_6_gameeducator.repository.NotaRepository;
import org.facens.grupo_6_gameeducator.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Aba de notas: "Como aluno, quero ver minhas notas de cada curso, para saber o meu progresso."
 *
 * <p>ETAPA GREEN do TDD: implementacao ingenua, apenas o suficiente para os
 * testes passarem. A checagem de matricula esta repetida em cada metodo.
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

    @Transactional(readOnly = true)
    public List<Nota> minhasNotas(Long alunoId, Long cursoId) {
        if (!matriculaRepository.existsByCursoIdAndAlunoId(cursoId, alunoId)) {
            throw new AcessoNegadoException("Aluno " + alunoId + " nao esta matriculado no curso " + cursoId);
        }
        return notaRepository.findByAlunoIdAndCursoIdOrderByIdAsc(alunoId, cursoId);
    }

    public Nota lancar(Long professorId, Long cursoId, Long alunoId, String avaliacao, BigDecimal valor) {
        Usuario professor = usuarioRepository.findById(professorId)
                .orElseThrow(() -> RecursoNaoEncontradoException.de("Usuario", professorId));
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> RecursoNaoEncontradoException.de("Curso", cursoId));
        if (!professor.isProfessor() || !curso.ehResponsavel(professor)) {
            throw new AcessoNegadoException("Somente o professor responsavel lanca notas no curso " + cursoId);
        }
        if (avaliacao == null || avaliacao.isBlank()) {
            throw new RegraDeNegocioException("Informe a avaliacao (ex.: 'Prova 1')");
        }
        if (valor == null
                || valor.compareTo(BigDecimal.ZERO) < 0
                || valor.compareTo(BigDecimal.TEN) > 0) {
            throw new RegraDeNegocioException("A nota precisa estar entre 0 e 10");
        }
        Usuario aluno = usuarioRepository.findById(alunoId)
                .orElseThrow(() -> RecursoNaoEncontradoException.de("Usuario", alunoId));
        if (!matriculaRepository.existsByCursoIdAndAlunoId(cursoId, alunoId)) {
            throw new AcessoNegadoException("Aluno " + alunoId + " nao esta matriculado no curso " + cursoId);
        }

        Nota existente = notaRepository
                .findByAlunoIdAndCursoIdAndAvaliacao(alunoId, cursoId, avaliacao)
                .orElse(null);
        if (existente != null) {
            existente.setValor(valor);
            return notaRepository.save(existente);
        }
        return notaRepository.save(new Nota(aluno, curso, avaliacao, valor));
    }
}
