package br.org.maoamiga;

import br.org.maoamiga.config.PontosSeed;
import br.org.maoamiga.repository.CargaInicialRepository;
import br.org.maoamiga.repository.PontoRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {"spring.datasource.url=jdbc:h2:mem:filtro;DB_CLOSE_DELAY=-1", "spring.jpa.hibernate.ddl-auto=create-drop"})
@AutoConfigureMockMvc
@Transactional
class PontoFiltroTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;
    @Autowired PontoRepository repository;
    @Autowired CargaInicialRepository cargas;
    @Autowired PontosSeed seed;
    private static final String URL = "/api/v1/pontos/filtro";

    private JsonNode consultar(String query) throws Exception {
        var resposta = mvc.perform(get(URL + query)).andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray()).andExpect(jsonPath("$.page").isMap()).andReturn();
        return mapper.readTree(resposta.getResponse().getContentAsString(java.nio.charset.StandardCharsets.UTF_8));
    }

    @Test void padraoDezItensOrdenadosPorNome() throws Exception {
        JsonNode page = consultar("");
        assertEquals(10, page.get("content").size());
        assertEquals(10, page.at("/page/size").asInt());
        assertEquals(25, page.at("/page/totalElements").asInt());
        assertEquals(3, page.at("/page/totalPages").asInt());
        assertEquals(0, page.at("/page/number").asInt());
        assertEquals("Campinas (demonstração)", page.at("/content/0/nome").asText());
        verificarOrdenacao(page, "nome");
    }

    @Test void registraExemplosDeRespostas() throws Exception {
        var pasta = java.nio.file.Path.of("target", "evidencias-n2-2");
        java.nio.file.Files.createDirectories(pasta);
        String[][] exemplos = {
            {"sem-filtro.json", "?size=1"},
            {"por-bairro.json", "?filtro=Setor%20Central&size=1"},
            {"segunda-pagina.json", "?page=1&size=1"}
        };
        for (String[] exemplo : exemplos) {
            // URI preserves the encoded space exactly as an HTTP request would.
            var resposta = mvc.perform(get(java.net.URI.create(URL + exemplo[1])))
                    .andExpect(status().isOk()).andReturn();
            var json = mapper.readTree(resposta.getResponse().getContentAsString(java.nio.charset.StandardCharsets.UTF_8));
            assertFalse(json.get("content").isEmpty());
            java.nio.file.Files.writeString(pasta.resolve(exemplo[0]),
                    mapper.writerWithDefaultPrettyPrinter().writeValueAsString(json));
        }
    }

    @Test void buscaNomeOuBairroIgnoraMaiusculas() throws Exception {
        assertEquals(consultar("?filtro=mercado").get("content"), consultar("?filtro=MERCADO").get("content"));
        assertEquals(1, consultar("?filtro=MERCADO").at("/page/totalElements").asInt());
        JsonNode bairro = consultar("?filtro=oEsTe");
        assertEquals(3, bairro.at("/page/totalElements").asInt());
        for (JsonNode ponto : bairro.get("content")) {
            assertTrue(ponto.get("bairro").asText().toLowerCase(Locale.ROOT).contains("oeste"));
        }
        assertEquals(25, consultar("?filtro=").at("/page/totalElements").asInt());
        assertEquals(0, consultar("?filtro=zzzinexistentezzz").get("content").size());
    }

    @Test void paginasSemRepeticaoEOrdenacaoAlternativa() throws Exception {
        Set<String> ids = new HashSet<>();
        for (int i = 0; i < 3; i++) {
            JsonNode pagina = consultar("?page=" + i);
            assertEquals(i, pagina.at("/page/number").asInt());
            assertEquals(i == 2 ? 5 : 10, pagina.get("content").size());
            for (JsonNode ponto : pagina.get("content")) assertTrue(ids.add(ponto.get("id").asText()));
        }
        assertEquals(25, ids.size());
        assertEquals(0, consultar("?page=3").get("content").size());
        verificarOrdenacao(consultar("?sort=bairro,asc&size=25"), "bairro");
        assertEquals(2, consultar("?size=2").get("content").size());
        mvc.perform(get("/api/v1/pontos")).andExpect(status().isOk()).andExpect(jsonPath("$").isArray());
    }

    private void verificarOrdenacao(JsonNode pagina, String campo) {
        String anterior = "";
        for (JsonNode ponto : pagina.get("content")) {
            String atual = ponto.get(campo).asText();
            assertTrue(anterior.compareTo(atual) <= 0);
            anterior = atual;
        }
    }

    @Test void atualizaBancoN2_1SemDuplicarOuTrocarIds() {
        // Simula a tabela com os oito registros antigos e sem marcador de migração.
        cargas.deleteAll();
        repository.deleteAll(repository.findAll().stream().filter(p -> p.getNome().startsWith("Ponto ")).toList());
        repository.flush();
        var idsAntigos = repository.findAll().stream().map(p -> p.getId()).toList();
        assertEquals(8, idsAntigos.size());
        seed.run();
        assertEquals(25, repository.count());
        for (var id : idsAntigos) assertTrue(repository.existsById(id));
        seed.run();
        assertEquals(25, repository.count());
        repository.deleteById(idsAntigos.getFirst());
        repository.flush();
        seed.run();
        assertEquals(24, repository.count());
        assertFalse(repository.existsById(idsAntigos.getFirst()));
    }
}
