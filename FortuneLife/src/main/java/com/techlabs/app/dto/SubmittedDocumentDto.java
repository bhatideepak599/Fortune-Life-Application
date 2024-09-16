package com.techlabs.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SubmittedDocumentDto {
	private Long id;

	@NotBlank
	private String documentName;

	private String documentStatus;
	
	@NotBlank
	private String documentImage;
}
