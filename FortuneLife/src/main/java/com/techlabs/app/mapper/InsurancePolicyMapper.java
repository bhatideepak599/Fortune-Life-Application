package com.techlabs.app.mapper;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.techlabs.app.dto.AgentDto;
import com.techlabs.app.dto.CommissionDto;
import com.techlabs.app.dto.InsurancePolicyResponseDto;
import com.techlabs.app.dto.SubmittedDocumentDto;
import com.techlabs.app.entity.Commission;
import com.techlabs.app.entity.InsurancePolicy;
import com.techlabs.app.entity.Nominee;
import com.techlabs.app.entity.SubmittedDocument;

@Component
public class InsurancePolicyMapper {

    @Autowired
    private PaymentMapper paymentMapper;
    @Autowired
    private CustomerMapper customerMapper;

    public InsurancePolicyResponseDto entityToDto(InsurancePolicy policy) {
        InsurancePolicyResponseDto response = new InsurancePolicyResponseDto();

        if (policy.getAgent() != null && policy.getAgent().getUser() != null) {
            String firstName = policy.getAgent().getUser().getFirstName() != null ? policy.getAgent().getUser().getFirstName() : "";
            String lastName = policy.getAgent().getUser().getLastName() != null ? policy.getAgent().getUser().getLastName() : "";
            response.setAgentName(firstName + " " + lastName);
            response.setAgentId(policy.getAgent().getUser().getId());
        }


        response.setId(policy.getId());
        response.setIssueDate(policy.getIssueDate());
        response.setMaturityDate(policy.getMaturityDate());
        response.setPolicyStatus(policy.getPolicyStatus());
        response.setPremiumAmount(policy.getPremiumAmount());
        response.setPremiumType(policy.getPremiumType());
        response.setSumAssured(policy.getSumAssured());
        response.setSchemeName(policy.getInsuranceScheme().getSchemeName());
        response.setVerified(policy.getVerified());
        response.setPaymentList(paymentMapper.getDtoList(policy.getPayments()));
        response.setTotalPolicyAmount(policy.getTotalPolicyAmount());
        response.setTotalAmountPaidTillDate(policy.getPaidPolicyAmountTillDate());

        if (policy.getClaims() != null) {
            response.setClaimId(policy.getClaims().getId());
            response.setClaimStatus(policy.getClaims().getClaimStatus());
        } else {
            response.setClaimId(null);
            response.setClaimStatus("N/A");
        }
        response.setCustomerDto(customerMapper.entityToDto(policy.getCustomer()));

        List<String> nominies = new ArrayList<>();

        for (Nominee n : policy.getNominees()) {
            String nameAndRelation = "Name: " + n.getNomineeName() + ", Relation:" + n.getRelationStatus();
            nominies.add(nameAndRelation);
        }
        response.setNomineeNameAndRelation(nominies);

        Set<SubmittedDocumentDto> documents = new HashSet<>();

        for (SubmittedDocument document : policy.getSubmittedDocuments()) {

            SubmittedDocumentDto documentDto = new SubmittedDocumentDto();

            documentDto.setDocumentImage(document.getDocumentImage());
            documentDto.setDocumentName(document.getDocumentName());
            documentDto.setDocumentStatus(document.getDocumentStatus());
            documentDto.setId(document.getId());
            documents.add(documentDto);
        }
        response.setSubmittedDocumentsDto(documents);

        return response;
    }

    public CommissionDto commissionEntityToDto(Commission commission) {
        CommissionDto commissionDto = new CommissionDto();
        commissionDto.setId(commission.getId());
        commissionDto.setAmount(commission.getAmount());
        commissionDto.setCommissionType(commission.getCommissionType());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy, hh:mm a");
        String formattedDate = commission.getIssueDate().format(formatter);
        commissionDto.setIssueDate(formattedDate);

        commissionDto.setPolicyId(commission.getPolicyId());
        commissionDto.setAgentId(commission.getAgent().getId());
        commissionDto.setAgentName(
                commission.getAgent().getUser().getFirstName() + " " + commission.getAgent().getUser().getFirstName());

        return commissionDto;
    }
}
