package br.org.maoamiga.service;

import br.org.maoamiga.dto.DoacaoRequestDTO;
import br.org.maoamiga.dto.DoacaoResponseDTO;
import br.org.maoamiga.entity.Doacao;
import br.org.maoamiga.repository.DoacaoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class DoacaoService {
    private final DoacaoRepository repository;

    public DoacaoService(DoacaoRepository repository) { this.repository = repository; }

    public Page<DoacaoResponseDTO> filtrar(String filtro, Pageable pageable) {
        return repository.filtrar(filtro == null ? "" : filtro.trim(), pageable)
                .map(DoacaoResponseDTO::de);
    }

    public DoacaoResponseDTO buscar(UUID id) { return DoacaoResponseDTO.de(encontrar(id)); }

    @Transactional
    public DoacaoResponseDTO cadastrar(DoacaoRequestDTO request) {
        Doacao doacao = new Doacao();
        preencher(doacao, request);
        // H2 armazena TIMESTAMP com precisão de microssegundos por padrão.
        doacao.setCriadoEm(LocalDateTime.now().truncatedTo(ChronoUnit.MICROS));
        return DoacaoResponseDTO.de(repository.save(doacao));
    }

    @Transactional
    public DoacaoResponseDTO editar(UUID id, DoacaoRequestDTO request) {
        Doacao doacao = encontrar(id);
        preencher(doacao, request);
        return DoacaoResponseDTO.de(repository.save(doacao));
    }

    @Transactional
    public void excluir(UUID id) { repository.delete(encontrar(id)); }

    private Doacao encontrar(UUID id) {
        return repository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Doação não encontrada"));
    }

    private void preencher(Doacao doacao, DoacaoRequestDTO request) {
        doacao.setTipoItem(request.tipoItem().trim());
        doacao.setQuantidade(request.quantidade());
        doacao.setPontoDestino(request.pontoDestino().trim());
    }
}
