package com.techlabs.app.service;

import com.techlabs.app.dto.ClaimDto;
import com.techlabs.app.util.PageResponse;

import jakarta.validation.Valid;

public interface ClaimService {

	ClaimDto applyForPolicyClaim(Long customerId, Long policyId, @Valid ClaimDto claimDto);

	PageResponse<ClaimDto> getAllClaims(Long id, String bankAccountNumber,String claimStatus,int page, int size);

	String approveOrRejectClaim(Long id,String operation,String message);

    ClaimDto getClaimById(Long id);
}
