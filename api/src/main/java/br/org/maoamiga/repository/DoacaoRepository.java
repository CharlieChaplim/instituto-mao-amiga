package br.org.maoamiga.repository;

import br.org.maoamiga.entity.Doacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.UUID;

public interface DoacaoRepository extends JpaRepository<Doacao, UUID> {
    @Query("""
        select d from Doacao d
        where :filtro = '' or lower(d.tipoItem) like lower(concat('%', :filtro, '%'))
        """)
    Page<Doacao> filtrar(@Param("filtro") String filtro, Pageable pageable);
}
