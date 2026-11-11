package br.org.maoamiga.config;

import br.org.maoamiga.dto.PontoRequestDTO;
import br.org.maoamiga.entity.CargaInicial;
import br.org.maoamiga.repository.CargaInicialRepository;
import br.org.maoamiga.repository.PontoRepository;
import br.org.maoamiga.service.PontoService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class PontosSeed implements CommandLineRunner {
    private final PontoRepository repository;
    private final PontoService service;
    private final CargaInicialRepository cargas;
    private static final String VERSAO = "N2-2-25-pontos";

    public PontosSeed(PontoRepository repository, PontoService service, CargaInicialRepository cargas) {
        this.repository = repository;
        this.service = service;
        this.cargas = cargas;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (cargas.existsById(VERSAO)) return;
        // Locais de referência em Goiânia; postos e horários são demonstrativos.
        adicionar("Mercado Central", "Rua 3, Goiânia - GO", "Setor Central", "coleta");
        adicionar("Praça Cívica", "Praça Dr. Pedro Ludovico Teixeira, Goiânia - GO", "Setor Central", "distribuição");
        adicionar("Praça do Sol", "Praça do Sol, Goiânia - GO", "Setor Oeste", "coleta");
        adicionar("Praça Tamandaré", "Praça Tamandaré, Goiânia - GO", "Setor Oeste", "coleta");
        adicionar("Campinas", "Av. 24 de Outubro, Goiânia - GO", "Campinas", "distribuição");
        adicionar("Praça Universitária", "Praça Universitária, Goiânia - GO", "Setor Leste Universitário", "coleta");
        adicionar("Parque Flamboyant", "Parque Flamboyant, Goiânia - GO", "Jardim Goiás", "distribuição");
        adicionar("Parque Vaca Brava", "Parque Vaca Brava, Goiânia - GO", "Setor Bueno", "coleta");
        adicionar("Ponto 01 - Setor Aeroporto", "Endereço demonstrativo 1, Setor Aeroporto, Goiânia - GO", "Setor Aeroporto", "coleta");
        adicionar("Ponto 02 - Setor Sul", "Endereço demonstrativo 2, Setor Sul, Goiânia - GO", "Setor Sul", "distribuição");
        adicionar("Ponto 03 - Setor Marista", "Endereço demonstrativo 3, Setor Marista, Goiânia - GO", "Setor Marista", "coleta");
        adicionar("Ponto 04 - Setor Pedro Ludovico", "Endereço demonstrativo 4, Setor Pedro Ludovico, Goiânia - GO", "Setor Pedro Ludovico", "distribuição");
        adicionar("Ponto 05 - Setor Bela Vista", "Endereço demonstrativo 5, Setor Bela Vista, Goiânia - GO", "Setor Bela Vista", "coleta");
        adicionar("Ponto 06 - Setor Nova Suíça", "Endereço demonstrativo 6, Setor Nova Suíça, Goiânia - GO", "Setor Nova Suíça", "distribuição");
        adicionar("Ponto 07 - Setor Coimbra", "Endereço demonstrativo 7, Setor Coimbra, Goiânia - GO", "Setor Coimbra", "coleta");
        adicionar("Ponto 08 - Setor dos Funcionários", "Endereço demonstrativo 8, Setor dos Funcionários, Goiânia - GO", "Setor dos Funcionários", "distribuição");
        adicionar("Ponto 09 - Setor Fama", "Endereço demonstrativo 9, Setor Fama, Goiânia - GO", "Setor Fama", "coleta");
        adicionar("Ponto 10 - Setor Negrão de Lima", "Endereço demonstrativo 10, Setor Negrão de Lima, Goiânia - GO", "Setor Negrão de Lima", "distribuição");
        adicionar("Ponto 11 - Setor Criméia Leste", "Endereço demonstrativo 11, Setor Criméia Leste, Goiânia - GO", "Setor Criméia Leste", "coleta");
        adicionar("Ponto 12 - Setor Criméia Oeste", "Endereço demonstrativo 12, Setor Criméia Oeste, Goiânia - GO", "Setor Criméia Oeste", "distribuição");
        adicionar("Ponto 13 - Setor Jaó", "Endereço demonstrativo 13, Setor Jaó, Goiânia - GO", "Setor Jaó", "coleta");
        adicionar("Ponto 14 - Jardim América", "Endereço demonstrativo 14, Jardim América, Goiânia - GO", "Jardim América", "distribuição");
        adicionar("Ponto 15 - Jardim Europa", "Endereço demonstrativo 15, Jardim Europa, Goiânia - GO", "Jardim Europa", "coleta");
        adicionar("Ponto 16 - Vila Nova", "Endereço demonstrativo 16, Vila Nova, Goiânia - GO", "Vila Nova", "distribuição");
        adicionar("Ponto 17 - Parque Amazônia", "Endereço demonstrativo 17, Parque Amazônia, Goiânia - GO", "Parque Amazônia", "coleta");
        cargas.save(new CargaInicial(VERSAO));
    }

    private void adicionar(String nome, String endereco, String bairro, String tipo) {
        String nomeCompleto = nome + " (demonstração)";
        if (repository.existsByNome(nomeCompleto)) return;
        service.cadastrar(new PontoRequestDTO(nomeCompleto, endereco, bairro,
                "Seg a Sex, 8h às 17h", tipo));
    }
}
