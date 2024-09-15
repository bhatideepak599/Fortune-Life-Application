package com.techlabs.app.controller;

import com.techlabs.app.dto.CommissionDto;
import com.techlabs.app.dto.InsurancePolicyResponseDto;
import com.techlabs.app.service.InsurancePolicyService;
import com.techlabs.app.util.PageResponse;
import io.swagger.v3.oas.annotations.Operation;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
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
			@RequestParam(required = false) String schemeName, @RequestParam(required = false) String agentName,
			@RequestParam(required = false) String policyStatus,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size) {
		logger.info("Fetching All The Policies");
		PageResponse<InsurancePolicyResponseDto> policies = policyService.getAllPolicies(id, customerId, agentId,
				schemeId, schemeName, agentName, policyStatus, page, size);

		return new ResponseEntity<>(policies, HttpStatus.OK);
	}

	@Secured({ "EMPLOYEE", "ADMIN" })
	@Operation(summary = "Get All Commission based on Search Criteria")
	@GetMapping("/commission")
	public ResponseEntity<PageResponse<CommissionDto>> getAllCommissions(@RequestParam(required = false) Long id,
			@RequestParam(required = false) Long policyId, @RequestParam(required = false) Long agentId,
			@RequestParam(required = false) String commissionType, @RequestParam(required = false) String customerName,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size) {
		logger.info("Fetching All The Policies");
		PageResponse<CommissionDto> commissions = policyService.getAllCommissions(id, policyId, agentId, commissionType,
				customerName, page, size);

		return new ResponseEntity<>(commissions, HttpStatus.OK);
	}

	@Secured({ "AGENT" })
	@Operation(summary = "Get All Commission of An Agent")
	@GetMapping("/all-commission")
	public ResponseEntity<PageResponse<CommissionDto>> getAllCommissionsOfAnAgent(
			@RequestParam(required = false) Long id, @RequestParam(required = false) Long policyId,
			@RequestParam(required = false) String commissionType,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size, HttpServletRequest request) {
		logger.info("Fetching All The Policies");
		PageResponse<CommissionDto> commissions = policyService.getAllCommissionsOfAnAgent(id, policyId, commissionType,
				page, size, request);

		return new ResponseEntity<>(commissions, HttpStatus.OK);
	}

	@Secured("AGENT")
	@Operation(summary = "Get All Claints Of An Agent")
	@GetMapping("/all-clients")
	public ResponseEntity<PageResponse<InsurancePolicyResponseDto>> getAllPoliciesUnderAnAgent(
			@RequestParam(required = false) Long id, @RequestParam(required = false) Long customerId,
			@RequestParam(required = false) String name, @RequestParam(required = false) String policyStatus,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size,
			HttpServletRequest request) {
		logger.info("Fetching All The Policies");
		PageResponse<InsurancePolicyResponseDto> policies = policyService.getAllPoliciesUnderAnAgent(id, customerId, name,
				policyStatus, page, size,request);

		return new ResponseEntity<>(policies, HttpStatus.OK);
	}

}
