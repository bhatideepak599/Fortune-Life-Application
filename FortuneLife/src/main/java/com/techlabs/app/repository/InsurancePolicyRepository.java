package com.techlabs.app.repository;

import com.techlabs.app.entity.InsuranceScheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.techlabs.app.entity.InsurancePolicy;

@Repository
public interface InsurancePolicyRepository extends JpaRepository<InsurancePolicy,Long > {
    @Query("SELECT ip.insuranceScheme FROM InsurancePolicy ip WHERE ip.id = :policyId")
    InsuranceScheme findInsuranceSchemeByPolicyId(@Param("policyId") Long policyId);
}
