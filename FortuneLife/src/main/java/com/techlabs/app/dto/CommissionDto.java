package com.techlabs.app.dto;

import lombok.Data;

@Data
public class CommissionDto {
	private Long id;

	private String commissionType;

	private String issueDate;

	private Double amount;

	private Long policyId;

	private Long agentId;
	private String agentName;
}
