package br.org.maoamiga.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** Registra cargas já aplicadas para não recriar pontos excluídos pelo usuário. */
@Entity
@Table(name = "cargas_iniciais")
public class CargaInicial {
    @Id private String versao;
    protected CargaInicial() {}
    public CargaInicial(String versao) { this.versao = versao; }
}
