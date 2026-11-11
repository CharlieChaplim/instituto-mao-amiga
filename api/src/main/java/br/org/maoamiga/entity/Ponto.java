package br.org.maoamiga.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.UUID;

@Entity
@Table(name = "pontos")
@Getter
@Setter
@NoArgsConstructor
public class Ponto {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false) private String nome;
    @Column(nullable = false) private String endereco;
    @Column(nullable = false) private String bairro;
    @Column(nullable = false) private String horario;
    @Column(nullable = false) private String tipo;
}
