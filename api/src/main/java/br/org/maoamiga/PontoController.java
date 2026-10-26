package br.org.maoamiga;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Set;
@RestController @RequestMapping("/pontos")
@CrossOrigin(origins = "*")
public class PontoController {
    private static final Set<String> ORDENACOES = Set.of("id", "nome", "endereco", "horario", "atendimento");
    private final PontoRepository repositorio;
    public PontoController(PontoRepository repositorio) { this.repositorio = repositorio; }
    @GetMapping public Page<PontoResponse> listar(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,asc") String sort) {
        if (page < 0 || size < 1) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Paginação inválida");
        String[] partes = sort.split(",", -1);
        if (partes.length > 2 || !ORDENACOES.contains(partes[0]) ||
           (partes.length == 2 && !partes[1].equalsIgnoreCase("asc") && !partes[1].equalsIgnoreCase("desc")))
           throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Ordenação inválida");
        Sort.Direction direcao = partes.length == 2 && partes[1].equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        return repositorio.findAll(PageRequest.of(page, Math.min(size, 50), Sort.by(direcao, partes[0]))).map(PontoResponse::de);
    }
    @GetMapping("/{id}") public PontoResponse buscar(@PathVariable Long id) {
        return repositorio.findById(id).map(PontoResponse::de).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Ponto não encontrado"));
    }
}
