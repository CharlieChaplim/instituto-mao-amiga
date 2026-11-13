package br.org.maoamiga;

import br.org.maoamiga.entity.Doacao;
import br.org.maoamiga.repository.DoacaoRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {"spring.datasource.url=jdbc:h2:mem:doacoes;DB_CLOSE_DELAY=-1", "spring.jpa.hibernate.ddl-auto=create-drop"})
@AutoConfigureMockMvc
@Transactional
class DoacaoControllerTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;
    @Autowired DoacaoRepository repository;
    private static final String URL = "/api/v1/doacoes";

    private ObjectNode corpo() {
        return mapper.createObjectNode().put("tipoItem", "Alimentos").put("quantidade", 3)
                .put("pontoDestino", "Mercado Central");
    }
    private JsonNode criar(ObjectNode body) throws Exception {
        var response = mvc.perform(post(URL).contentType(MediaType.APPLICATION_JSON).content(body.toString()))
                .andExpect(status().isCreated()).andExpect(header().exists("Location")).andReturn();
        return mapper.readTree(response.getResponse().getContentAsString());
    }
    @Test void crudPreservaIdEDataGeradaPeloServidor() throws Exception {
        var antes = LocalDateTime.now().minusSeconds(1);
        var criada = criar(corpo().put("criadoEm", "2000-01-01T00:00:00").put("id", UUID.randomUUID().toString()));
        String id = criada.get("id").asText();
        assertNotNull(UUID.fromString(id));
        var data = LocalDateTime.parse(criada.get("criadoEm").asText());
        assertTrue(data.isAfter(antes));
        assertTrue(data.isBefore(LocalDateTime.now().plusSeconds(1)));
        mvc.perform(get(URL + "/" + id)).andExpect(status().isOk())
                .andExpect(jsonPath("$.criadoEm").value(criada.get("criadoEm").asText()));
        mvc.perform(put(URL + "/" + id).contentType(MediaType.APPLICATION_JSON)
                .content(corpo().put("quantidade", 5).put("criadoEm", "1999-01-01T00:00:00").toString()))
                .andExpect(status().isOk()).andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.quantidade").value(5))
                .andExpect(jsonPath("$.criadoEm").value(criada.get("criadoEm").asText()));
        repository.flush();
        mvc.perform(delete(URL + "/" + id)).andExpect(status().isNoContent()).andExpect(content().string(""));
        mvc.perform(get(URL + "/" + id)).andExpect(status().isNotFound());
    }
    @Test void idsInexistentesRetornam404() throws Exception {
        String path = URL + "/" + UUID.randomUUID();
        mvc.perform(get(path)).andExpect(status().isNotFound());
        mvc.perform(put(path).contentType(MediaType.APPLICATION_JSON).content(corpo().toString())).andExpect(status().isNotFound());
        mvc.perform(delete(path)).andExpect(status().isNotFound());
    }
    @Test void validacaoNaoGravaNemAlteraDados() throws Exception {
        String id = criar(corpo()).get("id").asText();
        var invalidos = new java.util.ArrayList<ObjectNode>();
        for (String campo : new String[]{"tipoItem", "pontoDestino"}) {
            invalidos.add(corpo().put(campo, ""));
            invalidos.add(corpo().put(campo, "   "));
            invalidos.add(corpo().putNull(campo));
            var semCampo = corpo(); semCampo.remove(campo); invalidos.add(semCampo);
        }
        invalidos.add(corpo().put("quantidade", 0));
        invalidos.add(corpo().put("quantidade", -1));
        invalidos.add(corpo().putNull("quantidade"));
        invalidos.add(corpo().put("quantidade", 1.5));
        var ausente = corpo(); ausente.remove("quantidade"); invalidos.add(ausente);
        for (var invalido : invalidos) {
            mvc.perform(post(URL).contentType(MediaType.APPLICATION_JSON).content(invalido.toString())).andExpect(status().isBadRequest());
            mvc.perform(put(URL + "/" + id).contentType(MediaType.APPLICATION_JSON).content(invalido.toString())).andExpect(status().isBadRequest());
        }
        assertEquals(1, repository.count());
        mvc.perform(get(URL + "/" + id)).andExpect(jsonPath("$.quantidade").value(3))
                .andExpect(jsonPath("$.tipoItem").value("Alimentos"));
    }
    @Test void buscaPaginadaPorTipoOrdenaDaMaisNova() throws Exception {
        for (int i = 0; i < 12; i++) {
            Doacao d = new Doacao(); d.setTipoItem(i % 2 == 0 ? "Roupas" : "Alimentos");
            d.setQuantidade(1); d.setPontoDestino("Destino");
            d.setCriadoEm(LocalDateTime.of(2026, 1, 1, 12, 0).plusMinutes(i)); repository.save(d);
        }
        mvc.perform(get(URL + "/filtro")).andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(10)).andExpect(jsonPath("$.page.totalElements").value(12))
                .andExpect(jsonPath("$.page.totalPages").value(2)).andExpect(jsonPath("$.content[0].criadoEm").value("2026-01-01T12:11:00"));
        mvc.perform(get(URL + "/filtro?page=1")).andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2)).andExpect(jsonPath("$.page.number").value(1));
        mvc.perform(get(URL + "/filtro").param("filtro", " rOuP ")).andExpect(status().isOk())
                .andExpect(jsonPath("$.page.totalElements").value(6)).andExpect(jsonPath("$.content[0].tipoItem").value("Roupas"));
        mvc.perform(get(URL + "/filtro?filtro=inexistente")).andExpect(jsonPath("$.content").isEmpty());
    }
    @Test void openApiECorsDisponiveis() throws Exception {
        mvc.perform(get("/v3/api-docs")).andExpect(status().isOk())
                .andExpect(jsonPath("$.paths['/api/v1/doacoes'].post").exists())
                .andExpect(jsonPath("$.paths['/api/v1/doacoes/{id}'].put").exists());
        mvc.perform(options(URL).header("Origin", "http://localhost:8081").header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Origin", "*"));
    }
}
