package com.techlabs.app.service;

import com.techlabs.app.dto.CommissionDto;
import com.techlabs.app.dto.InsurancePolicyDto;
import com.techlabs.app.dto.InsurancePolicyResponseDto;

import com.techlabs.app.util.PageResponse;
import jakarta.validation.Valid;

public interface InsurancePolicyService {

	InsurancePolicyResponseDto addNewPolicy(Long customerId, Long schemeId,InsurancePolicyDto insurancePolicyDto);

	InsurancePolicyResponseDto addNewPolicyByAgentForCustomer(Long customerId, Long schemeId, Long agentId,
			@Valid InsurancePolicyDto insurancePolicyDto);

    InsurancePolicyResponseDto getPolicyById(Long policyId);

	PageResponse<InsurancePolicyResponseDto> getAllPolicies(Long id, Long customerId, Long agentId, Long schemeId,
			String schemeName, String customerName, String policyStatus, int page, int size);

	PageResponse<CommissionDto> getAllCommissions(Long id, Long policyId, Long agentId, String commissionType,
			String customerName, int page, int size);

}
