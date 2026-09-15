package org.facens.grupo_6_gameeducator.service.dto;

import java.util.List;

/**
 * Dados de um desafio informados pelo professor no formulario de nova missao.
 *
 * @param indiceRespostaCorreta indice (base 0) da alternativa correta
 * @param xp XP creditado ao aluno no primeiro acerto
 */
public record NovoDesafioRequest(
        String enunciado,
        List<String> alternativas,
        int indiceRespostaCorreta,
        int xp
) {
}
