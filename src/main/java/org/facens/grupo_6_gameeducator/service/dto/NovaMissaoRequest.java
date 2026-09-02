package org.facens.grupo_6_gameeducator.service.dto;

import java.util.List;

public record NovaMissaoRequest(
        String titulo,
        String descricao,
        List<NovoDesafioRequest> desafios
) {
}
