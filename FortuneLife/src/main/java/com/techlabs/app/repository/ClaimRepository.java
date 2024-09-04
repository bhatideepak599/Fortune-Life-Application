package com.techlabs.app.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.techlabs.app.entity.Claim;


@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
	@Query("SELECT a FROM Claim a " +
		       "WHERE (:id IS NULL OR a.id = :id) " +
		       "AND (:bankAccountNumber IS NULL OR a.bankAccountNumber = :bankAccountNumber) "+
		       "AND (:claimStatus IS NULL OR a.claimStatus LIKE %:claimStatus%) ")
	Page<Claim> findByIdAndBankAccountNumberAndClaimStatus(@Param("id") Long id,
         @Param("bankAccountNumber") String bankAccountNumber,
         @Param("claimStatus") String claimStatus,   Pageable pageable);
	

}
