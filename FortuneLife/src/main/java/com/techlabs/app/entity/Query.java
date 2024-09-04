package com.techlabs.app.entity;

import com.techlabs.app.enums.ResponseStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Query {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotEmpty(message = "Title is required")
	@Column(nullable = false)
	private String title;

	@NotEmpty(message = "Message is required")
	@Column(nullable = false)
	private String question;

	private String answer;

	@NotBlank
	private String queryResponse=ResponseStatus.PENDING.name();

	private Boolean active = true;

	@NotBlank
	@Email
	@Column(nullable = false)
	private String email;

}
