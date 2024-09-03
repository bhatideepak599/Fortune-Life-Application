package com.techlabs.app.entity;

import java.time.LocalDateTime;

import com.techlabs.app.enums.PaymentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Payment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private String paymentType;

	@Column(nullable = false)
	private Double amount;

	@Column(nullable = false)
	private LocalDateTime paymentDate = LocalDateTime.now();

	private Double tax;
	private Double totalPayment;

	@Column(nullable = false)
	@NotBlank
	private String cardNumber;

	@Column(nullable = false)
	@NotNull
	private Integer cvv;

	@Column(nullable = false)
	private String expiry;// check validation for expiry

	@Column(nullable = false)
	private String paymentStatus = PaymentStatus.UNPAID.name();
}
