package com.techlabs.app.service;

import java.util.ArrayList;
import java.util.List;

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

	public ClaimServiceImpl(CustomerRepository customerRepository, InsurancePolicyRepository insurancePolicyRepository,
			ClaimRepository claimRepository, ClaimMapper claimMapper) {
		super();
		this.customerRepository = customerRepository;
		this.insurancePolicyRepository = insurancePolicyRepository;
		this.claimRepository = claimRepository;
		this.claimMapper = claimMapper;
	}

	@Override
	public ClaimDto applyForPolicyClaim(Long customerId, Long policyId, ClaimDto claimDto) {
		Customer customer = customerRepository.findById(customerId)
				.orElseThrow(() -> new CustomerRelatedException("No Customer Found With  Customer Id: " + customerId));
		InsurancePolicy insurancePolicy = insurancePolicyRepository.findById(policyId)
				.orElseThrow(() -> new FortuneLifeException("No Policy Found for the Policy Number :" + policyId));

		if (!insurancePolicy.getPolicyStatus().equals("ACTIVE")
				|| !insurancePolicy.getPolicyStatus().equals("COMPLETE"))
			throw new FortuneLifeException("Policy Is Not Completed  or Inactive");
		Claim claim = claimMapper.dtoToEntity(claimDto);
		if(claim.getClaimAmount()>insurancePolicy.getSumAssured()) {
			new FortuneLifeException("Amount Should be less than Assured Amount!.");
		}
		claim.setPolicy(insurancePolicy);
		claim = claimRepository.save(claim);
		insurancePolicy.setClaims(claim);
		insurancePolicyRepository.save(insurancePolicy);
		return claimMapper.entityToDto(claim);
	}

	@Override
	public PageResponse<ClaimDto> getAllClaims(Long id, String bankAccountNumber, String claimStatus, int page,
			int size) {
		Pageable pageable = PageRequest.of(page, size);
		Page<Claim> claims = claimRepository.findByIdAndBankAccountNumberAndClaimStatus(id, bankAccountNumber,
				claimStatus, pageable);
		if (claims.getContent().isEmpty()) {

			throw new FortuneLifeException(" No Calims  Found! ");
		}
		List<ClaimDto> response = new ArrayList<>();
		claims.getContent().forEach((claim) -> response.add(claimMapper.entityToDto(claim)));

		return new PageResponse<>(response, claims.getNumber(), claims.getNumberOfElements(), claims.getTotalElements(),
				claims.getTotalPages(), claims.isLast());

	}

	@Override
	public String approveOrRejectClaim(Long id, String operation ){
		Claim claim=claimRepository.findById(id)
				.orElseThrow(()->new FortuneLifeException("No Claim found!"));
		if(claim.getClaimStatus().equals("APPROVED"))
			throw new FortuneLifeException("Claim Already Approved.");
		
		if(operation.equals("REJECT")) {
			claim.setClaimStatus("REJECT");
			claimRepository.save(claim);
			return "Claim Rejected";
		}
		claim.setClaimStatus("APPROVED");
		claimRepository.save(claim);
		return "Claim Approved";
		
	}

}
