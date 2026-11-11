package br.org.maoamiga.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PontoRequestDTO(
    @NotBlank @Size(max = 255) String nome,
    @NotBlank @Size(max = 255) String endereco,
    @NotBlank @Size(max = 255) String bairro,
    @NotBlank @Size(max = 255) String horario,
    @NotBlank @Pattern(regexp = "coleta|distribuição", message = "deve ser coleta ou distribuição") String tipo
) {}
