package com.techlabs.app.dto;
import java.time.LocalDateTime;


public class CommissionDto {
	private Long id;


	private String commissionType;

	private LocalDateTime issueDate;

	private Double amount;

	private Long policyId;

	private AgentDto agentdto; 
}
