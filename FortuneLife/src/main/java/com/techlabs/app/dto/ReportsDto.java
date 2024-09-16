package com.techlabs.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReportsDto {
    private Long customerCount;
    private Long agentCount;
    private Long employeeCount;
    private Long policyCount;
    private Double customerPolicyRatio;
}
