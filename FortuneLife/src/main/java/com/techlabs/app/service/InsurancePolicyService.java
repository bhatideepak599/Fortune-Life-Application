package com.techlabs.app.service;

import com.techlabs.app.dto.InsurancePolicyDto;
import com.techlabs.app.dto.InsurancePolicyResponseDto;

import jakarta.validation.Valid;

public interface InsurancePolicyService {

	InsurancePolicyResponseDto addNewPolicy(Long customerId, Long schemeId,InsurancePolicyDto insurancePolicyDto);

	InsurancePolicyResponseDto addNewPolicyByAgentForCustomer(Long customerId, Long schemeId, Long agentId,
			@Valid InsurancePolicyDto insurancePolicyDto);

}
