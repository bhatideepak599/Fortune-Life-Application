package com.techlabs.app.service;

import com.techlabs.app.dto.*;

import com.techlabs.app.util.PageResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import java.util.List;

public interface InsurancePolicyService {

    InsurancePolicyResponseDto addNewPolicy(Long customerId, Long schemeId, InsurancePolicyDto insurancePolicyDto);

    InsurancePolicyResponseDto addNewPolicyByAgentForCustomer(Long customerId, Long schemeId, Long agentId,
                                                              @Valid InsurancePolicyDto insurancePolicyDto);

    InsurancePolicyResponseDto getPolicyById(Long policyId);

    PageResponse<InsurancePolicyResponseDto> getAllPolicies(Long id, Long customerId, Long agentId, Long schemeId,
                                                            String schemeName, String customerName, String policyStatus, Boolean verified, int page, int size, String sortBy, String direction);

    PageResponse<CommissionDto> getAllCommissions(Long id, Long policyId, Long agentId, String commissionType,
                                                  String customerName, int page, int size);

    PageResponse<CommissionDto> getAllCommissionsOfAnAgent(Long id, Long policyId, String commissionType, int page, int size, HttpServletRequest
            request);

    PageResponse<InsurancePolicyResponseDto> getAllPoliciesUnderAnAgent(Long id, Long customerId, String name,
                                                                        String policyStatus, int page, int size, HttpServletRequest request);

	 List<PolicyReport> getPolicyReport();


    InsurancePolicyResponseDto updateSubmittedDocuments(Long policyId, List<SubmittedDocumentDto> documentDtos);

    InsurancePolicyResponseDto verifyPolicyDocuments(Long policyId, List<SubmittedDocumentDto> documentDtos);
}
