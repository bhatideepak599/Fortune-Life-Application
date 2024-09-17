package com.techlabs.app.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class ClaimDto {
    private Long id;
    @PositiveOrZero(message = "Amount Should be Greater than Zero")
    private Double claimAmount;
    @NotBlank
    private String bankName;

    @NotBlank
    private String branchName;

    private String remarks;
    @NotBlank
    private String bankAccountNumber;
    @NotBlank
    private String ifscCode;
    private LocalDateTime date;
    private String claimStatus;

    private InsurancePolicyResponseDto policy;
}
