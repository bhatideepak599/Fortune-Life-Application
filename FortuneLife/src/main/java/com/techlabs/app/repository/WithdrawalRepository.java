package com.techlabs.app.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.techlabs.app.entity.Withdrawal;

@Repository
public interface WithdrawalRepository extends JpaRepository<Withdrawal, Long> {
	@Query("SELECT w FROM Withdrawal w WHERE " + "(:id IS NULL OR w.id = :id) AND "
			+ "(:agentId IS NULL OR w.agent.id = :agentId) AND " + "(:status IS NULL OR w.status = :status)")
	Page<Withdrawal> findByIdAndAgentIdAndStatus(@Param("id") Long id, @Param("agentId") Long agentId,
			@Param("status") String status, Pageable pageable);

}
