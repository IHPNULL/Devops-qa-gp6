package org.facens.grupo_6_gameeducator.service;

import java.util.List;
import org.facens.grupo_6_gameeducator.domain.Curso;
import org.facens.grupo_6_gameeducator.domain.Desafio;
import org.facens.grupo_6_gameeducator.domain.ProgressoAluno;
import org.facens.grupo_6_gameeducator.domain.Tentativa;
import org.facens.grupo_6_gameeducator.domain.Usuario;
import org.facens.grupo_6_gameeducator.exception.AcessoNegadoException;
import org.facens.grupo_6_gameeducator.exception.RecursoNaoEncontradoException;
import org.facens.grupo_6_gameeducator.exception.RegraDeNegocioException;
import org.facens.grupo_6_gameeducator.repository.DesafioRepository;
import org.facens.grupo_6_gameeducator.repository.MatriculaRepository;
import org.facens.grupo_6_gameeducator.repository.ProgressoAlunoRepository;
import org.facens.grupo_6_gameeducator.repository.TentativaRepository;
import org.facens.grupo_6_gameeducator.repository.UsuarioRepository;
import org.facens.grupo_6_gameeducator.service.dto.ResultadoResposta;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * US01 - Como aluno, quero resolver os desafios de uma missao e receber XP por acerto,
 * para aprender jogando e saber o meu progresso.
 */
@Service
@Transactional
public class JogoService {

    private final UsuarioRepository usuarioRepository;
    private final DesafioRepository desafioRepository;
    private final MatriculaRepository matriculaRepository;
    private final TentativaRepository tentativaRepository;
    private final ProgressoAlunoRepository progressoAlunoRepository;

    public JogoService(UsuarioRepository usuarioRepository,
                       DesafioRepository desafioRepository,
                       MatriculaRepository matriculaRepository,
                       TentativaRepository tentativaRepository,
                       ProgressoAlunoRepository progressoAlunoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.desafioRepository = desafioRepository;
        this.matriculaRepository = matriculaRepository;
        this.tentativaRepository = tentativaRepository;
        this.progressoAlunoRepository = progressoAlunoRepository;
    }

    /**
     * Registra a resposta do aluno a um desafio e credita o XP quando ele acerta.
     * O XP de um desafio e creditado uma unica vez: reacertar o mesmo desafio nao acumula XP.
     */
    public ResultadoResposta responder(Long alunoId, Long desafioId, int indiceResposta) {
        Usuario aluno = usuarioRepository.findById(alunoId)
                .orElseThrow(() -> RecursoNaoEncontradoException.de("Usuario", alunoId));
        if (!aluno.isAluno()) {
            throw new AcessoNegadoException("Somente um aluno pode responder desafios");
        }

        Desafio desafio = desafioRepository.findById(desafioId)
                .orElseThrow(() -> RecursoNaoEncontradoException.de("Desafio", desafioId));
        if (indiceResposta < 0 || indiceResposta >= desafio.getAlternativas().size()) {
            throw new RegraDeNegocioException("Alternativa inexistente para o desafio " + desafioId);
        }

        Curso curso = desafio.getMissao().getCurso();
        if (!matriculaRepository.existsByCursoIdAndAlunoId(curso.getId(), alunoId)) {
            throw new AcessoNegadoException("Aluno " + alunoId + " nao esta matriculado no curso " + curso.getId());
        }

        boolean correta = desafio.estaCorreta(indiceResposta);
        boolean jaTinhaAcertado = tentativaRepository.existsByAlunoIdAndDesafioIdAndCorretaTrue(alunoId, desafioId);
        int xpGanho = (correta && !jaTinhaAcertado) ? desafio.getXp() : 0;

        ProgressoAluno progresso = progressoDoAluno(aluno, curso);
        progresso.creditarXp(xpGanho);
        progressoAlunoRepository.save(progresso);

        tentativaRepository.save(new Tentativa(aluno, desafio, indiceResposta, correta, xpGanho));

        return new ResultadoResposta(correta, xpGanho, progresso.getXpTotal());
    }

    /** XP acumulado do aluno em um curso. Zero enquanto ele nao pontuou. */
    @Transactional(readOnly = true)
    public int xpNoCurso(Long alunoId, Long cursoId) {
        return progressoAlunoRepository.findByAlunoIdAndCursoId(alunoId, cursoId)
                .map(ProgressoAluno::getXpTotal)
                .orElse(0);
    }

    /** Historico de tentativas do aluno em um desafio, da mais recente para a mais antiga. */
    @Transactional(readOnly = true)
    public List<Tentativa> historico(Long alunoId, Long desafioId) {
        return tentativaRepository.findByAlunoIdAndDesafioIdOrderByDataHoraDesc(alunoId, desafioId);
    }

    /** Ranking de XP da turma, do maior para o menor. */
    @Transactional(readOnly = true)
    public List<ProgressoAluno> ranking(Long cursoId) {
        return progressoAlunoRepository.findByCursoIdOrderByXpTotalDesc(cursoId);
    }

    private ProgressoAluno progressoDoAluno(Usuario aluno, Curso curso) {
        return progressoAlunoRepository.findByAlunoIdAndCursoId(aluno.getId(), curso.getId())
                .orElseGet(() -> new ProgressoAluno(aluno, curso));
    }
}
