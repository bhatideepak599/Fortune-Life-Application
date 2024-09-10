package com.techlabs.app.controller;

import com.techlabs.app.dto.InsurancePolicyResponseDto;
import com.techlabs.app.service.InsurancePolicyService;
import com.techlabs.app.util.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fortuneLife/policy")
public class PolicyController {

	private static final Logger logger = LoggerFactory.getLogger(PolicyController.class);

	@Autowired
	private InsurancePolicyService policyService;

	@Operation(summary = "Get Policy By ID")
	@GetMapping("/{policyId}")
	public ResponseEntity<InsurancePolicyResponseDto> getPolicyById(@PathVariable Long policyId) {
		logger.info("Fetching Policy with ID: {}", policyId);
		InsurancePolicyResponseDto policyDto = policyService.getPolicyById(policyId);
		return new ResponseEntity<>(policyDto, HttpStatus.OK);
	}

	@Operation(summary = "Get All Policies based on Search Criteria")
	@GetMapping
	public ResponseEntity<PageResponse<InsurancePolicyResponseDto>> getAllPolicies(
			@RequestParam(required = false) Long id, @RequestParam(required = false) Long customerId,
			@RequestParam(required = false) Long agentId, @RequestParam(required = false) Long schemeId,
			@RequestParam(required = false) String schemeName, @RequestParam(required = false) String customerName,
			@RequestParam(required = false) String policyStatus,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size) {
		logger.info("Fetching All The Policies");
		PageResponse<InsurancePolicyResponseDto> policies = policyService.getAllPolicies(id, customerId, agentId, schemeId,
				schemeName, customerName, policyStatus, page, size);

		return new ResponseEntity<>(policies, HttpStatus.OK);
	}

}
