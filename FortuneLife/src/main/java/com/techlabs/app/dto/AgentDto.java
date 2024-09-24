package com.techlabs.app.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AgentDto {

	private Long id;
	private Boolean active;
	private String image;
	private Boolean verified;
	private Double totalCommission = 0.0;

	@Pattern(regexp = "^[0-9]{10,15}$", message = "Account number must be between 10 and 15 digits")
	private String accountNumber;

	@Size(max = 50, message = "Bank name must not exceed 50 characters")
	private String bankName;

	@Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$", message = "IFSC code must be 11 characters: first four letters, fifth character must be '0', followed by six alphanumeric characters")
	private String ifscCode;
	private int totalTransactions ;
	private UserDto userDto;
}
