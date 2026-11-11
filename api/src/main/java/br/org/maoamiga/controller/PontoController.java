package br.org.maoamiga.controller;

import br.org.maoamiga.dto.PontoRequestDTO;
import br.org.maoamiga.dto.PontoResponseDTO;
import br.org.maoamiga.service.PontoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/pontos")
@CrossOrigin(origins = "*")
public class PontoController {
    private final PontoService service;

    public PontoController(PontoService service) { this.service = service; }

    @GetMapping
    public List<PontoResponseDTO> listar() { return service.listar(); }

    @GetMapping("/filtro")
    public Page<PontoResponseDTO> filtrar(
            @RequestParam(defaultValue = "") String filtro,
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        return service.filtrar(filtro, pageable);
    }

    @GetMapping("/{id}")
    public PontoResponseDTO buscar(@PathVariable UUID id) { return service.buscar(id); }

    @PostMapping
    public ResponseEntity<PontoResponseDTO> cadastrar(@Valid @RequestBody PontoRequestDTO request) {
        PontoResponseDTO resposta = service.cadastrar(request);
        var location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(resposta.id()).toUri();
        return ResponseEntity.created(location).body(resposta);
    }

    @PutMapping("/{id}")
    public PontoResponseDTO editar(@PathVariable UUID id, @Valid @RequestBody PontoRequestDTO request) {
        return service.editar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
