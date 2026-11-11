package br.org.maoamiga.repository;

import br.org.maoamiga.entity.Ponto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface PontoRepository extends JpaRepository<Ponto, UUID> {}
