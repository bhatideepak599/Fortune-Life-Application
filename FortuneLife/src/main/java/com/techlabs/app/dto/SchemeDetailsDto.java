package com.techlabs.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SchemeDetailsDto {

    private Long id;

    private String schemeImage;

    @NotBlank(message = "Description is required")
    private String description;

    @PositiveOrZero(message = "Minimum amount must be a non-negative number")
    private Double minAmount;

    @PositiveOrZero(message = "Maximum amount must be a non-negative number")
    private Double maxAmount;

    @PositiveOrZero(message = "Minimum investment time must be a non-negative number")
    private Integer minInvestmentTime;

    @PositiveOrZero(message = "Maximum investment time must be a non-negative number")
    private Integer maxInvestmentTime;

    @PositiveOrZero(message = "Minimum age must be a non-negative number")
    private Integer minAge;

    @PositiveOrZero(message = "Maximum age must be a non-negative number")
    private Integer maxAge;

    @PositiveOrZero(message = "Profit ratio must be a non-negative number")
    private Double profitRatio;

    @PositiveOrZero(message = "Registration commission ratio must be a non-negative number")
    private Double registrationCommissionAmount;

    @PositiveOrZero(message = "Installment commission ratio must be a non-negative number")
    private Double installmentCommissionRatio;

    private Set<SchemeDocumentDto> documents = new HashSet<>();
}
