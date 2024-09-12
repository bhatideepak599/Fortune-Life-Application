package com.techlabs.app.dto;

import lombok.Data;

@Data
public class AgentDto {

	private Long id;
	private Boolean active;
	private String image;
	private Boolean verified;
	private Double totalCommission = 0.0;
	private String accountNumber;
	private String bankName;
	private String ifscCode;
	private int totalTransactions ;
	private UserDto userDto;
}
