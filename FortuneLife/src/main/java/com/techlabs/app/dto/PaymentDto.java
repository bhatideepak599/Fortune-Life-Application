package com.techlabs.app.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class PaymentDto {
	
	private Long id;
	private String paymentType;
	private Double amount;
	private LocalDateTime paymentDate;
	private Double tax;
	private Double totalPayment;
	private String paymentStatus;
}
