package br.org.maoamiga.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "doacoes")
@Getter
@Setter
@NoArgsConstructor
public class Doacao {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false) private String tipoItem;
    @Column(nullable = false) private Integer quantidade;
    @Column(nullable = false) private String pontoDestino;
    @Column(nullable = false, updatable = false) private LocalDateTime criadoEm;
}
