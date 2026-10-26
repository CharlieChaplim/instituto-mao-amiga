package br.org.maoamiga;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest @AutoConfigureMockMvc class PontoControllerTest {
 @Autowired MockMvc mvc;
 @Test void listaPaginada() throws Exception {mvc.perform(get("/pontos?size=3&sort=nome,asc")).andExpect(status().isOk()).andExpect(jsonPath("$.content.length()").value(3)).andExpect(jsonPath("$.page.size").value(3));}
 @Test void limiteDePagina() throws Exception {mvc.perform(get("/pontos?size=200")).andExpect(status().isOk()).andExpect(jsonPath("$.page.size").value(50));}
 @Test void inexistenteRetorna404() throws Exception {mvc.perform(get("/pontos/999999")).andExpect(status().isNotFound());}
 @Test void identificadorExistente() throws Exception {mvc.perform(get("/pontos/1")).andExpect(status().isOk()).andExpect(jsonPath("$.latitude").isNumber());}
}
