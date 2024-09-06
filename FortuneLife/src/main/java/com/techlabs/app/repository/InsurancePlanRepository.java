package com.techlabs.app.repository;

import com.techlabs.app.entity.InsurancePlan;
import com.techlabs.app.entity.InsuranceScheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InsurancePlanRepository extends JpaRepository<InsurancePlan, Long> {
    Optional<InsurancePlan> findByPlanName(String planName);

    @Query("SELECT s FROM InsurancePlan p JOIN p.schemes s WHERE p.id = :planId AND s.id = :schemeId")
    Optional<InsuranceScheme> findSchemeByPlanIdAndSchemeId(@Param("planId") Long planId, @Param("schemeId") Long schemeId);
}
