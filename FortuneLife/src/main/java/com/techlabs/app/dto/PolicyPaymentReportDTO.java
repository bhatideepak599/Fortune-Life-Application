package com.techlabs.app.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class PolicyPaymentReportDTO {
    private String policyNumber;
    private String policyHolderName;
    private String policyType;
    private LocalDateTime paymentDate;
    private Double paymentAmount;
    private String paymentMethod;
    private String paymentStatus;
    private String agentName;
}
