package com.techlabs.app.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class WithdrawalDto {

	private Long id;
	
	private LocalDateTime withdrawalDate;
	
	@NotNull
	@PositiveOrZero(message = "Amount Should be Greater than Zero")
	private Double amount;

	private String status;

	private AgentDto agentDto;
}
