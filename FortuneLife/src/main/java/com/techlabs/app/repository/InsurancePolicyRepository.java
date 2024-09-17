package com.techlabs.app.repository;


import com.techlabs.app.dto.PolicyReport;
import com.techlabs.app.entity.InsurancePolicy;
import com.techlabs.app.entity.InsuranceScheme;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InsurancePolicyRepository extends JpaRepository<InsurancePolicy, Long> {
    @Query("SELECT ip.insuranceScheme FROM InsurancePolicy ip WHERE ip.id = :policyId")
    InsuranceScheme findInsuranceSchemeByPolicyId(@Param("policyId") Long policyId);

    @Query("SELECT i FROM InsurancePolicy i " +
            "JOIN i.customer c " +
            "JOIN c.user u " +
            "JOIN i.insuranceScheme s " +
            "WHERE (:id IS NULL OR i.id = :id) " +
            "AND (:customerId IS NULL OR c.id = :customerId) " +
            "AND (:agentId IS NULL OR i.agent.id = :agentId) " +
            "AND (:schemeId IS NULL OR s.id = :schemeId) " +
            "AND (:name IS NULL OR LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:schemeName IS NULL OR LOWER(s.schemeName) LIKE LOWER(CONCAT('%', :schemeName, '%'))) " +
            "AND (:policyStatus IS NULL OR i.policyStatus = :policyStatus)")
    Page<InsurancePolicy> findAllPoliciesBasedOnSearch(@Param("id") Long id,
                                                       @Param("customerId") Long customerId,
                                                       @Param("agentId") Long agentId,
                                                       @Param("schemeId") Long schemeId,
                                                       @Param("schemeName") String schemeName,
                                                       @Param("name") String name,
                                                       @Param("policyStatus") String policyStatus,
                                                       Pageable pageable);

    @Query("SELECT i FROM InsurancePolicy i " +
            "JOIN i.customer c " +
            "JOIN c.user u " +
            "JOIN i.insuranceScheme s " +
            "WHERE (:id IS NULL OR i.id = :id) " +
            "AND (:customerId IS NULL OR c.id = :customerId) " +
            "AND (:agentId IS NULL OR i.agent.id = :agentId) " +
            "AND (:schemeId IS NULL OR s.id = :schemeId) " +
            "AND (:name IS NULL OR LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:schemeName IS NULL OR LOWER(s.schemeName) LIKE LOWER(CONCAT('%', :schemeName, '%'))) " +
            "AND (:policyStatus IS NULL OR i.policyStatus = :policyStatus) " +
            "AND (:verified IS NULL OR i.verified = :verified)")
    Page<InsurancePolicy> findAllPoliciesBasedOnCritaria(@Param("id") Long id,
                                                       @Param("customerId") Long customerId,
                                                       @Param("agentId") Long agentId,
                                                       @Param("schemeId") Long schemeId,
                                                       @Param("schemeName") String schemeName,
                                                       @Param("name") String name,
                                                       @Param("policyStatus") String policyStatus,
                                                       @Param("verified") Boolean verified,
                                                       Pageable pageable);


    @Query("SELECT p.issueDate AS date, COUNT(p) AS policiesBought, SUM(p.premiumAmount) AS totalRevenue " +
            "FROM InsurancePolicy p GROUP BY p.issueDate ORDER BY p.issueDate ASC")
    List<PolicyReport> getPolicyReport();



}
