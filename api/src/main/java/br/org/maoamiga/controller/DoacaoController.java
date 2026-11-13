package br.org.maoamiga.controller;

import br.org.maoamiga.dto.DoacaoRequestDTO;
import br.org.maoamiga.dto.DoacaoResponseDTO;
import br.org.maoamiga.service.DoacaoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/doacoes")
@CrossOrigin(origins = "*")
public class DoacaoController {
    private final DoacaoService service;

    public DoacaoController(DoacaoService service) { this.service = service; }

    @GetMapping("/filtro")
    public Page<DoacaoResponseDTO> filtrar(@RequestParam(defaultValue = "") String filtro,
            @PageableDefault(size = 10, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return service.filtrar(filtro, pageable);
    }

    @GetMapping("/{id}")
    public DoacaoResponseDTO buscar(@PathVariable UUID id) { return service.buscar(id); }

    @PostMapping
    public ResponseEntity<DoacaoResponseDTO> cadastrar(@Valid @RequestBody DoacaoRequestDTO request) {
        DoacaoResponseDTO resposta = service.cadastrar(request);
        var location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(resposta.id()).toUri();
        return ResponseEntity.created(location).body(resposta);
    }

    @PutMapping("/{id}")
    public DoacaoResponseDTO editar(@PathVariable UUID id, @Valid @RequestBody DoacaoRequestDTO request) {
        return service.editar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
