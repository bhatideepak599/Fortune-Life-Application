package com.techlabs.app.dto;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.techlabs.app.entity.Payment;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InsurancePolicyResponseDto {

    private Long id;
    private LocalDate issueDate;
    private LocalDate maturityDate;
    private String premiumType;
    private Double sumAssured;
    private Double premiumAmount;
    private String policyStatus;
    private String schemeName;
    private String agentName;
    private Long agentId;
    private CustomerDto customerDto;
    private Long claimId;
    private String claimStatus;
    private List<PaymentDto> paymentList;
    private Double totalPolicyAmount;
    private Double totalAmountPaidTillDate;
    private List<String> nomineeNameAndRelation;
    private Boolean verified;
    private Set<SubmittedDocumentDto> submittedDocumentsDto = new HashSet<>();

}
