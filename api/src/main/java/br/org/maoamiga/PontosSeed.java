package br.org.maoamiga;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
@Component public class PontosSeed implements CommandLineRunner {
    private final PontoRepository repository;
    public PontosSeed(PontoRepository repository) {this.repository = repository;}
    @Override public void run(String... args) {
        if (repository.count() != 0) return;
        // Locais de referência geográfica de Goiânia. Pontos de doação e horários fictícios para demonstração.
        repository.save(new Ponto("Mercado Central (demonstração)","Rua 3, Setor Central, Goiânia - GO", "Segunda a sexta, 8h às 17h", "Recebe alimentos e itens de higiene",-16.6737,-49.2555));
        repository.save(new Ponto("Praça Cívica (demonstração)","Praça Dr. Pedro Ludovico Teixeira, Centro, Goiânia - GO", "Terça e quinta, 9h às 16h", "Distribui cestas básicas",-16.6799,-49.2560));
        repository.save(new Ponto("Praça do Sol (demonstração)","Praça do Sol, Setor Oeste, Goiânia - GO", "Quarta e sábado, 7h às 13h", "Recebe roupas",-16.6872,-49.2732));
        repository.save(new Ponto("Praça Tamandaré (demonstração)","Praça Tamandaré, Setor Oeste, Goiânia - GO", "Segunda e quarta, 13h às 18h", "Recebe cobertores e calçados",-16.6860,-49.2696));
        repository.save(new Ponto("Campinas (demonstração)","Av. 24 de Outubro, Setor Campinas, Goiânia - GO", "Terça a sexta, 10h às 17h", "Distribui alimentos e roupas",-16.6700,-49.2920));
        repository.save(new Ponto("Praça Universitária (demonstração)","Praça Universitária, Setor Leste Universitário, Goiânia - GO", "Segunda a sexta, 7h30 às 11h30", "Recebe livros e materiais escolares",-16.6791,-49.2424));
        repository.save(new Ponto("Parque Flamboyant (demonstração)","Parque Flamboyant, Jardim Goiás, Goiânia - GO", "Segunda e quinta, 8h às 15h", "Distribui produtos de limpeza",-16.7093,-49.2325));
        repository.save(new Ponto("Parque Vaca Brava (demonstração)","Parque Vaca Brava, Setor Bueno, Goiânia - GO", "Quarta e sexta, 9h às 19h", "Recebe alimentos e roupas",-16.7069,-49.2739));
    }
}
