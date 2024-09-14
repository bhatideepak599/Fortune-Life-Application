package com.techlabs.app.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class Commission {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String commissionType;



	@Column(nullable = false)
	private LocalDateTime issueDate=LocalDateTime.now();

	@PositiveOrZero(message = "Amount Should be Greater than Zero")
	@Column(nullable = false)
	private Double amount;
	
	@Column(nullable=false)
	private Long policyId;

	@ManyToOne(cascade = { CascadeType.ALL})
	@JoinColumn(name = "agentId")
	private Agent agent; 
}
