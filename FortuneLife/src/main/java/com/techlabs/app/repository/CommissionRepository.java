package com.techlabs.app.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.techlabs.app.entity.Commission;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, Long> {

	@Query("SELECT c FROM Commission c " + "JOIN c.agent a " + "JOIN a.user u " +

			"WHERE (:id IS NULL OR c.id = :id) " + "AND (:policyId IS NULL OR c.policyId = :policyId) "
			+ "AND (:agentId IS NULL OR c.agent.id = :agentId) " +

			"AND (:agentFirstName IS NULL OR LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :agentFirstName, '%'))) "
			+ "AND (:commissionType IS NULL OR LOWER(c.commissionType) LIKE LOWER(CONCAT('%', :commissionType, '%'))) ")
	Page<Commission> findByCriteria(@Param("id") Long id, @Param("policyId") Long policyId,
			@Param("agentId") Long agentId, @Param("commissionType") String commissionType,
			@Param("agentFirstName") String agentFirstName, Pageable pageable);

}
