package br.org.maoamiga.config;

import br.org.maoamiga.dto.PontoRequestDTO;
import br.org.maoamiga.repository.PontoRepository;
import br.org.maoamiga.service.PontoService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class PontosSeed implements CommandLineRunner {
    private final PontoRepository repository;
    private final PontoService service;

    public PontosSeed(PontoRepository repository, PontoService service) {
        this.repository = repository;
        this.service = service;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (repository.count() != 0) return;
        // Locais de referência em Goiânia; postos e horários são demonstrativos.
        adicionar("Mercado Central", "Rua 3, Goiânia - GO", "Setor Central", "coleta");
        adicionar("Praça Cívica", "Praça Dr. Pedro Ludovico Teixeira, Goiânia - GO", "Setor Central", "distribuição");
        adicionar("Praça do Sol", "Praça do Sol, Goiânia - GO", "Setor Oeste", "coleta");
        adicionar("Praça Tamandaré", "Praça Tamandaré, Goiânia - GO", "Setor Oeste", "coleta");
        adicionar("Campinas", "Av. 24 de Outubro, Goiânia - GO", "Campinas", "distribuição");
        adicionar("Praça Universitária", "Praça Universitária, Goiânia - GO", "Setor Leste Universitário", "coleta");
        adicionar("Parque Flamboyant", "Parque Flamboyant, Goiânia - GO", "Jardim Goiás", "distribuição");
        adicionar("Parque Vaca Brava", "Parque Vaca Brava, Goiânia - GO", "Setor Bueno", "coleta");
    }

    private void adicionar(String nome, String endereco, String bairro, String tipo) {
        service.cadastrar(new PontoRequestDTO(nome + " (demonstração)", endereco, bairro,
                "Seg a Sex, 8h às 17h", tipo));
    }
}
