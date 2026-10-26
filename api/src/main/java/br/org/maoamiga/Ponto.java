package br.org.maoamiga;
import jakarta.persistence.*;
@Entity @Table(name = "pontos")
public class Ponto {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String nome;
    @Column(nullable = false) private String endereco;
    @Column(nullable = false) private String horario;
    @Column(nullable = false, length = 1000) private String atendimento;
    @Column(nullable = false) private Double latitude;
    @Column(nullable = false) private Double longitude;
    protected Ponto() {}
    public Ponto(String nome, String endereco, String horario, String atendimento, Double latitude, Double longitude) {
        this.nome=nome;this.endereco=endereco;this.horario=horario;this.atendimento=atendimento;this.latitude=latitude;this.longitude=longitude;
    }
    public Long getId(){return id;} public String getNome(){return nome;} public String getEndereco(){return endereco;}
    public String getHorario(){return horario;} public String getAtendimento(){return atendimento;}
    public Double getLatitude(){return latitude;} public Double getLongitude(){return longitude;}
}
