package com.techlabs.app.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import com.techlabs.app.config.EmailSender;
import com.techlabs.app.dto.EmailDTO;
import com.techlabs.app.enums.ClaimStatus;
import com.techlabs.app.enums.PolicyStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.techlabs.app.dto.ClaimDto;
import com.techlabs.app.entity.Claim;
import com.techlabs.app.entity.Customer;
import com.techlabs.app.entity.InsurancePolicy;
import com.techlabs.app.exception.CustomerRelatedException;
import com.techlabs.app.exception.FortuneLifeException;
import com.techlabs.app.mapper.ClaimMapper;
import com.techlabs.app.mapper.InsurancePolicyMapper;
import com.techlabs.app.repository.ClaimRepository;
import com.techlabs.app.repository.CustomerRepository;
import com.techlabs.app.repository.InsurancePolicyRepository;
import com.techlabs.app.util.PageResponse;

@Service
public class ClaimServiceImpl implements ClaimService {
    private CustomerRepository customerRepository;
    private InsurancePolicyRepository insurancePolicyRepository;
    private ClaimRepository claimRepository;

    private ClaimMapper claimMapper;
    private ClaimDto claimDto;

    @Autowired
    private EmailSender emailSender;

    public ClaimServiceImpl(CustomerRepository customerRepository, InsurancePolicyRepository insurancePolicyRepository,
                            ClaimRepository claimRepository, ClaimMapper claimMapper) {
        super();
        this.customerRepository = customerRepository;
        this.insurancePolicyRepository = insurancePolicyRepository;
        this.claimRepository = claimRepository;
        this.claimMapper = claimMapper;
    }

    @Override
    public ClaimDto applyForPolicyClaim(Long customerId, String policyId, ClaimDto claimDto) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerRelatedException("No Customer Found With  Customer Id: " + customerId));
        InsurancePolicy insurancePolicy = insurancePolicyRepository.findById(policyId)
                .orElseThrow(() -> new FortuneLifeException("No Policy Found for the Policy Number :" + policyId));

        if (!insurancePolicy.getPolicyStatus().equals("ACTIVE") && !insurancePolicy.getPolicyStatus().equals("COMPLETE")) {
            throw new FortuneLifeException("Policy Is Not Completed or Inactive");
        }

        if (!insurancePolicy.getVerified()) {
            throw new FortuneLifeException("Cannot apply for claim, Policy Not verified yet");
        }

        if (claimDto.getId() != null) {
            Optional<Claim> existingClaim = claimRepository.findById(claimDto.getId());
            if (existingClaim.isPresent()) {

                Claim changeClaim = existingClaim.get();
                Double claimAmount = changeClaim.getClaimAmount();
                claimAmount = Double.parseDouble(String.format("%.2f", claimAmount));
                changeClaim.setClaimAmount(claimAmount);
                changeClaim.setRemarks(claimDto.getRemarks());
                changeClaim.setClaimStatus("PENDING");
                changeClaim = claimRepository.save(changeClaim);
                return claimMapper.entityToDto(changeClaim);
            }
        }

        Claim claim = claimMapper.dtoToEntity(claimDto);
        if (claim.getClaimAmount() > insurancePolicy.getSumAssured()) {
            throw new FortuneLifeException("Amount Should be less than Assured Amount!.");
        }
        Double claimAmount = claim.getClaimAmount();
        claimAmount = Double.parseDouble(String.format("%.2f", claimAmount));
        claim.setClaimAmount(claimAmount);

        claim.setPolicy(insurancePolicy);
        claim = claimRepository.save(claim);
        insurancePolicy.setClaims(claim);
        insurancePolicyRepository.save(insurancePolicy);

        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setTo(customer.getUser().getEmail());
        emailDTO.setSubject("FortuneLife : Claim process for Insurance Policy with ID : "+insurancePolicy.getId()+" has been initiated");

        String emailBody = "Dear " + customer.getUser().getFirstName() + ",\n\n"+" you have successfully applied for " +
                "claim of your insurance policy with ID : "+insurancePolicy.getId();

        emailDTO.setBody(emailBody);
        emailSender.sendMailWithAttachement(emailDTO);

        return claimDto;
    }

    @Override
    public PageResponse<ClaimDto> getAllClaims(Long id, String bankAccountNumber, String claimStatus, int page,
                                               int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Claim> claims = claimRepository.findByIdAndBankAccountNumberAndClaimStatus(id, bankAccountNumber,
                claimStatus, pageable);
        if (claims.getContent().isEmpty()) {

            throw new FortuneLifeException(" No Claims  Found! ");
        }
        List<ClaimDto> response = new ArrayList<>();
        claims.getContent().forEach((claim) -> response.add(claimMapper.entityToDto(claim)));

        return new PageResponse<>(response, claims.getNumber(), claims.getNumberOfElements(), claims.getTotalElements(),
                claims.getTotalPages(), claims.isLast());

    }

    @Override
    public String approveOrRejectClaim(Long id, String operation, String message) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new FortuneLifeException("No Claim found!"));
        if (claim.getClaimStatus().equals("APPROVED"))
            throw new FortuneLifeException("Claim Already Approved.");

        if (operation.equals("REJECT")) {
            claim.setClaimStatus(ClaimStatus.REJECT.name());
            claim.setRemarks(message);
            claimRepository.save(claim);

            EmailDTO emailDTO = new EmailDTO();
            emailDTO.setTo(claim.getPolicy().getCustomer().getUser().getEmail());
            emailDTO.setSubject("FortuneLife : Claim for the Insurance Policy with ID : "+claim.getPolicy().getId()+
                    " has been Rejected");

            String emailBody = "Dear " + claim.getPolicy().getCustomer().getUser().getFirstName() + ",\n\n"+" your " +
                    "request for claim of policy with ID "+claim.getPolicy().getId()+" has been rejected." +
                    "Please re-apply";

            emailDTO.setBody(emailBody);
            emailSender.sendMailWithAttachement(emailDTO);

            return "Claim Rejected";
        }
        claim.setClaimStatus(ClaimStatus.APPROVED.name());
        InsurancePolicy policy = claim.getPolicy();
        if(Objects.equals(policy.getPaidPolicyAmountTillDate(),(policy.getTotalPolicyAmount())) && policy.getMaturityDate().isBefore(claim.getDate().toLocalDate())){
            claim.getPolicy().setPolicyStatus(PolicyStatus.COMPLETE.name());
        }
        else{
            claim.getPolicy().setPolicyStatus(PolicyStatus.DROP.name());
        }

        claim.setRemarks(message);
        claimRepository.save(claim);

        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setTo(claim.getPolicy().getCustomer().getUser().getEmail());
        emailDTO.setSubject("FortuneLife : Claim for the Insurance Policy with ID : "+claim.getPolicy().getId()+
                " has been Approved");

        String emailBody = "Dear " + claim.getPolicy().getCustomer().getUser().getFirstName() + ",\n\n"+" your " +
                "request for claim of policy with ID "+claim.getPolicy().getId()+" has been approved." +
                "\n\n your claim amount will ne deposited into your provided bank account number";

        emailDTO.setBody(emailBody);
        emailSender.sendMailWithAttachement(emailDTO);

        return "Claim Approved";

    }

    @Override
    public ClaimDto getClaimById(Long id) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new FortuneLifeException("Claim with ID" + id + " cannot be Found"));
        return claimMapper.entityToDto(claim);
    }
}
