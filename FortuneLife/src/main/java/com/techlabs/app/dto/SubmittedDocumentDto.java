package com.techlabs.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SubmittedDocumentDto {
	private Long id;
	private String documentName;
	@NotBlank
	private String documentStatus;
	
	@NotBlank
	private String documentImage;
}