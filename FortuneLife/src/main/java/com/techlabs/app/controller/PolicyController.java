package com.techlabs.app.controller;

import com.techlabs.app.dto.InsurancePolicyResponseDto;
import com.techlabs.app.service.InsurancePolicyService;
import io.swagger.v3.oas.annotations.Operation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
