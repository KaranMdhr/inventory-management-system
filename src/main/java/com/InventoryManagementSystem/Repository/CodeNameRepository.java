package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.InventoryManagementSystem.Model.CodeName;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface CodeNameRepository extends JpaRepository<CodeName, Long> {

    List<CodeName> findByTypeIgnoreCase(String companyType);
    List<CodeName> findByCodeNameIgnoreCaseAndCodeIgnoreCase(String codeName, String code);

    @Query("SELECT COUNT(c) > 0 FROM CodeName c WHERE LOWER(c.codeName) = LOWER(:codeName) AND LOWER(c.type) = LOWER(:type)AND c.display=true")
    boolean existsByCodeName(@Param("codeName") String codeName, @Param("type") String type);

    @Query("SELECT COUNT(c) > 0 FROM CodeName c WHERE LOWER(c.codeName) = LOWER(:codeName) AND (LOWER(c.type) = LOWER(:type) OR LOWER(c.type) = 'category')AND c.display=true")
    boolean existsByCodeNamesub(@Param("codeName") String codeName, @Param("type") String type);

    @Query("SELECT COUNT(c) > 0 FROM CodeName c WHERE LOWER(c.codeName) = LOWER(:codeName) AND c.display=true")
    boolean existsByCodeName(@Param("codeName") String codeName);

    @Query("SELECT COUNT(c) > 0 FROM CodeName c WHERE LOWER(c.code) = LOWER(:code) AND c.display=true")
    boolean existsByCode(@Param("code") String code);

    @Query("SELECT c FROM CodeName c WHERE (LOWER(c.codeName) = LOWER(:codeName) OR LOWER(c.code) = LOWER(:code)) AND c.display=false")
    CodeName findFirstByCodeNameIgnoreCaseOrCodeIgnoreCaseAndDisplay(@Param("codeName") String codeName, @Param("code") String code, @Param("display") boolean display);

    CodeName findByCode(String branchTypeCode);

    boolean existsByCodeNameIgnoreCase(String branchName);

    List<CodeName> findByCodeNameIgnoreCaseAndTypeIgnoreCase(String codeName, String type);

    Optional<CodeName> findByCodeNameIgnoreCaseAndType(String name, String type);
}