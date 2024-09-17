package com.techlabs.app.controller;

import com.techlabs.app.dto.ClaimDto;
import com.techlabs.app.service.ClaimService;
import com.techlabs.app.util.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("fortuneLife/claim")
public class ClaimController {
    private static final Logger logger = LoggerFactory.getLogger(ClaimController.class);
    @Autowired
    private ClaimService claimService;

    @Operation(summary = "Apply For Policy Claim ")
    @PostMapping("/customer/{customerId}/Insurance-policy/{policyId}")
    public ResponseEntity<ClaimDto> applyForPolicyClaim(@PathVariable(name = "customerId") Long customerId,
                                                        @PathVariable(name = "policyId") Long policyId, @Valid @RequestBody ClaimDto claimDto) {
        logger.info("Claiming the Policy>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        System.out.println(claimDto.toString());

        ClaimDto claim = claimService.applyForPolicyClaim(customerId, policyId, claimDto);

        return new ResponseEntity<>(claim, HttpStatus.OK);
    }

    @Operation(summary = "All Pending Claims For Approval")
    @GetMapping
    public ResponseEntity<PageResponse<ClaimDto>> getAllClaims(@RequestParam(required = false) Long id,
                                                               @RequestParam(required = false) String bankAccountNumber,
                                                               @RequestParam(required = false) String claimStatus,
                                                               @RequestParam(name = "page", defaultValue = "0") int page,
                                                               @RequestParam(name = "size", defaultValue = "10") int size) {
        logger.info("Fetching All The Claim Requests");
        PageResponse<ClaimDto> claims = claimService.getAllClaims(id, bankAccountNumber, claimStatus, page, size);

        return new ResponseEntity<>(claims, HttpStatus.OK);
    }

    @Operation(summary = "Approve Or Reject A Claim")
    @PutMapping("/approve/{id}")
    public ResponseEntity<String> approveOrRejectClaim(@PathVariable("id") Long id,
                                                       @RequestParam String operation, @RequestParam String message) {
        logger.info("Approving Or Rejecting A claim");
        String activatedMessage = claimService.approveOrRejectClaim(id, operation, message);
        return new ResponseEntity<>(activatedMessage, HttpStatus.OK);
    }

    @Operation(summary = "Get claim by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ClaimDto> getClaimById(@PathVariable(name = "id") Long id) {
        logger.info("Fetching The Claim by ID");
        ClaimDto claim = claimService.getClaimById(id);

        return new ResponseEntity<>(claim, HttpStatus.OK);
    }
}
