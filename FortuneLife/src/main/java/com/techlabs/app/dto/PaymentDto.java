package com.techlabs.app.dto;

import lombok.Data;

@Data
public class PaymentDto {
	private String policyHolderName;
    private String paymentMethodId;
    private Long policyId;
    private String paymentType;
    private Double amount;
    private Double tax;
    private Double totalPayment;
}
