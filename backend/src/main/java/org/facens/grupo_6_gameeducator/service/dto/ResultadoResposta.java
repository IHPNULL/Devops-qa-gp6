package org.facens.grupo_6_gameeducator.service.dto;

/**
 * Retorno de uma resposta enviada pelo aluno.
 *
 * @param correta se a alternativa escolhida e a correta
 * @param xpGanho XP creditado nesta resposta (0 quando erra ou quando ja tinha acertado antes)
 * @param xpTotalNoCurso XP acumulado do aluno no curso apos esta resposta
 */
public record ResultadoResposta(
        boolean correta,
        int xpGanho,
        int xpTotalNoCurso
) {
}
