package com.techlabs.app.entity;

import java.time.LocalDateTime;

import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.techlabs.app.enums.ClaimStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Claim {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)

	private Long id;

	@NotNull
	@PositiveOrZero(message = "Amount Should be Greater than Zero")
	@Column(nullable = false)
	private Double claimAmount;

	@Column(nullable = false)
	@NotBlank
	@Size(max = 50, message = "Bank name must not exceed 50 characters")
	private String bankName;

	@Column(nullable = false)
	@NotBlank
	@Size(max = 50, message = "Branch name must not exceed 50 characters")
	private String branchName;
	
	@NotBlank
	@Column(nullable = false)
	@Pattern(regexp = "^[0-9]{10,15}$", message = "Account number must be between 10 and 15 digits")
	private String bankAccountNumber;

	@Column(nullable = false)
	@NotBlank
	@Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$", message = "IFSC code must be 11 characters: first four letters, fifth character must be '0', followed by six alphanumeric characters")
	private String ifscCode;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDateTime date=LocalDateTime.now();

	private String claimStatus=ClaimStatus.PENDING.name();
	private String remarks;

	@OneToOne
	@JoinColumn(name = "policyId")
	private InsurancePolicy policy;
	
	@ManyToOne(cascade = { CascadeType.ALL })
	@JoinColumn(name = "agentId")
	private Agent agent;
}
