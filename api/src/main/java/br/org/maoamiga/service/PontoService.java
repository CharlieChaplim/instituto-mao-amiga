package br.org.maoamiga.service;

import br.org.maoamiga.dto.PontoRequestDTO;
import br.org.maoamiga.dto.PontoResponseDTO;
import br.org.maoamiga.entity.Ponto;
import br.org.maoamiga.repository.PontoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class PontoService {
    private final PontoRepository repository;

    public PontoService(PontoRepository repository) { this.repository = repository; }

    public List<PontoResponseDTO> listar() {
        return repository.findAll().stream().map(PontoResponseDTO::de).toList();
    }

    public Page<PontoResponseDTO> filtrar(String filtro, Pageable pageable) {
        return repository.filtrar(filtro == null ? "" : filtro.trim(), pageable)
                .map(PontoResponseDTO::de);
    }

    public PontoResponseDTO buscar(UUID id) { return PontoResponseDTO.de(encontrar(id)); }

    @Transactional
    public PontoResponseDTO cadastrar(PontoRequestDTO request) {
        Ponto ponto = new Ponto();
        preencher(ponto, request);
        return PontoResponseDTO.de(repository.save(ponto));
    }

    @Transactional
    public PontoResponseDTO editar(UUID id, PontoRequestDTO request) {
        Ponto ponto = encontrar(id);
        preencher(ponto, request);
        return PontoResponseDTO.de(repository.save(ponto));
    }

    @Transactional
    public void excluir(UUID id) { repository.delete(encontrar(id)); }

    private Ponto encontrar(UUID id) {
        return repository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Ponto não encontrado"));
    }

    private void preencher(Ponto ponto, PontoRequestDTO request) {
        ponto.setNome(request.nome().trim());
        ponto.setEndereco(request.endereco().trim());
        ponto.setBairro(request.bairro().trim());
        ponto.setHorario(request.horario().trim());
        ponto.setTipo(request.tipo());
    }
}
