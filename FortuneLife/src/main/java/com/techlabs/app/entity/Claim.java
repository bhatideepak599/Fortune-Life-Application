package com.techlabs.app.entity;

import java.time.LocalDateTime;

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
	private String bankName;

	@Column(nullable = false)
	@NotBlank
	private String branchName;
	
	@NotBlank
	@Column(nullable = false)
	private String bankAccountNumber;

	@Column(nullable = false)
	@NotBlank
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
