package com.techlabs.app.dto;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import lombok.Data;

@Data
public class InsurancePolicyResponseDto {

	private Long id;
	private LocalDate issueDate;
	private LocalDate maturityDate;
	private String premiumType;
	private Double sumAssured;
	private Double premiumAmount;
	private String policyStatus ;
	private String schemeName;
	private String agentName; 
	private Long agentId;
	private List<String> nomineeNameAndRelation;
	private Set<SubmittedDocumentDto> submittedDocumentsDto = new HashSet<>();
}
