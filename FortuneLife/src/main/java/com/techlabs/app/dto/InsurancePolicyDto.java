package com.techlabs.app.dto;
import java.util.HashSet;
import java.util.Set;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InsurancePolicyDto {
	@NotBlank
	private String premiumType;
	@PositiveOrZero(message = "Amount Should be Greater than Zero")
	private Double policyAmount;
	@NotNull
	private Integer time;
	
	@PositiveOrZero(message = "Amount Should be Greater than Zero")
	private Double premiumAmount;
	
	private String nomineeName;
	private String relationStatusWithNominee;
	
	private Set<SubmittedDocumentDto> submittedDocumentsDto = new HashSet<>();
}
