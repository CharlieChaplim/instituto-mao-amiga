package br.org.maoamiga;

import br.org.maoamiga.config.PontosSeed;
import br.org.maoamiga.repository.PontoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Map;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {"spring.datasource.url=jdbc:h2:mem:testes;DB_CLOSE_DELAY=-1", "spring.jpa.hibernate.ddl-auto=create-drop"})
@AutoConfigureMockMvc
class PontoControllerTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;
    @Autowired PontoRepository repository;
    @Autowired PontosSeed seed;
    private static final String URL = "/api/v1/pontos";

    private String corpo(String nome) throws Exception {
        return mapper.writeValueAsString(Map.of("nome", nome, "endereco", "Rua 3", "bairro", "Centro",
                "horario", "Seg a Sex, 8h às 17h", "tipo", "coleta"));
    }

    @Test void crudCompleto() throws Exception {
        var resposta = mvc.perform(post(URL).contentType(MediaType.APPLICATION_JSON).content(corpo("Novo ponto")))
                .andExpect(status().isCreated()).andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.bairro").value("Centro")).andReturn();
        String id = mapper.readTree(resposta.getResponse().getContentAsString()).get("id").asText();
        assertNotNull(UUID.fromString(id));
        mvc.perform(get(URL)).andExpect(status().isOk()).andExpect(jsonPath("$").isArray());
        mvc.perform(get(URL + "/" + id)).andExpect(status().isOk()).andExpect(jsonPath("$.nome").value("Novo ponto"));
        mvc.perform(put(URL + "/" + id).contentType(MediaType.APPLICATION_JSON).content(corpo("Editado")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.id").value(id)).andExpect(jsonPath("$.nome").value("Editado"));
        mvc.perform(delete(URL + "/" + id)).andExpect(status().isNoContent()).andExpect(content().string(""));
        mvc.perform(get(URL + "/" + id)).andExpect(status().isNotFound());
    }

    @Test void inexistentesRetornam404() throws Exception {
        String url = URL + "/" + UUID.randomUUID();
        mvc.perform(get(url)).andExpect(status().isNotFound());
        mvc.perform(put(url).contentType(MediaType.APPLICATION_JSON).content(corpo("Novo"))).andExpect(status().isNotFound());
        mvc.perform(delete(url)).andExpect(status().isNotFound());
    }

    @Test void camposInvalidosNaoGravamNemAlteram() throws Exception {
        var response = mvc.perform(post(URL).contentType(MediaType.APPLICATION_JSON).content(corpo("Original"))).andReturn();
        String id = mapper.readTree(response.getResponse().getContentAsString()).get("id").asText();
        long total = repository.count();
        for (String campo : new String[]{"nome", "endereco", "bairro", "horario", "tipo"}) {
            for (String valor : new String[]{"", "   "}) {
                var body = mapper.readTree(corpo("Alterado"));
                ((com.fasterxml.jackson.databind.node.ObjectNode) body).put(campo, valor);
                mvc.perform(post(URL).contentType(MediaType.APPLICATION_JSON).content(body.toString())).andExpect(status().isBadRequest());
                mvc.perform(put(URL + "/" + id).contentType(MediaType.APPLICATION_JSON).content(body.toString())).andExpect(status().isBadRequest());
            }
            var body = (com.fasterxml.jackson.databind.node.ObjectNode) mapper.readTree(corpo("Alterado"));
            body.remove(campo);
            mvc.perform(post(URL).contentType(MediaType.APPLICATION_JSON).content(body.toString())).andExpect(status().isBadRequest());
        }
        mvc.perform(post(URL).contentType(MediaType.APPLICATION_JSON).content(corpo("Novo").replace("coleta", "outro"))).andExpect(status().isBadRequest());
        assertEquals(total, repository.count());
        mvc.perform(get(URL + "/" + id)).andExpect(jsonPath("$.nome").value("Original"));
        mvc.perform(delete(URL + "/" + id)).andExpect(status().isNoContent());
    }

    @Test void cargaInicialNaoDuplica() {
        long total = repository.count();
        assertTrue(total >= 8);
        seed.run();
        assertEquals(total, repository.count());
    }

    @Test void corsESwaggerDisponiveis() throws Exception {
        mvc.perform(options(URL).header("Origin", "http://localhost:8081").header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Origin", "*"));
        mvc.perform(get("/v3/api-docs")).andExpect(status().isOk()).andExpect(jsonPath("$.paths['/api/v1/pontos']").exists());
    }
}
