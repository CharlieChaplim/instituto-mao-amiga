package br.org.maoamiga.dto;

import br.org.maoamiga.entity.Doacao;
import java.time.LocalDateTime;
import java.util.UUID;

public record DoacaoResponseDTO(UUID id, String tipoItem, Integer quantidade,
                                String pontoDestino, LocalDateTime criadoEm) {
    public static DoacaoResponseDTO de(Doacao doacao) {
        return new DoacaoResponseDTO(doacao.getId(), doacao.getTipoItem(),
                doacao.getQuantidade(), doacao.getPontoDestino(), doacao.getCriadoEm());
    }
}
