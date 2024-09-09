package com.techlabs.app.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PaymentDto {
    private String policyHolderName;
    private String paymentMethodId;
    private Long policyId;
    private Long paymentId;
    private LocalDateTime dateOfPayment;
    private String paymentType;
    private Double amount;
    private Double tax;
    private Double totalPayment;
    private String paymentStatus;
}
