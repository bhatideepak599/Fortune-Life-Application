package com.techlabs.app.dto;

import java.time.LocalDate;

import com.techlabs.app.enums.PolicyStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

public class InsurancePolicyDto {
	
	private Long id;

	
	private LocalDate issueDate = LocalDate.now();

	
	private LocalDate maturityDate;

	
	@NotBlank
	private String premiumType;

	
	@PositiveOrZero(message = "Amount Should be Greater than Zero")
	private Double sumAssured;

	
	@PositiveOrZero(message = "Amount Should be Greater than Zero")
	private Double premiumAmount;

	
	private String policyStatus = PolicyStatus.PENDING.name();

	
//	private InsuranceScheme insuranceScheme;
//
//	
//	private Agent agent;
//
//	
//	private List<Nominee> nominees;
//
//	
//	private List<Payment> payments;
//
//	
//	private Claim claims;
//
//	
//	private Set<SubmittedDocument> submittedDocuments = new HashSet<>();
}
