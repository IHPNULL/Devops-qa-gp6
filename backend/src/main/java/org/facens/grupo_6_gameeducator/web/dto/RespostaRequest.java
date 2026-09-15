package org.facens.grupo_6_gameeducator.web.dto;

/**
 * Corpo do POST em que o aluno envia sua resposta.
 *
 * @param indiceResposta indice (base 0) da alternativa escolhida
 */
public record RespostaRequest(Integer indiceResposta) {
}
