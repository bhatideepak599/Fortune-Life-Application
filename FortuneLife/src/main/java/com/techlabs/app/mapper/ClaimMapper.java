package com.techlabs.app.mapper;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.techlabs.app.dto.ClaimDto;
import com.techlabs.app.entity.Claim;
import com.techlabs.app.enums.ClaimStatus;

@Component
public class ClaimMapper {
	@Autowired
	private InsurancePolicyMapper insurancePolicyMapper;
	public Claim dtoToEntity(ClaimDto dto) {
		Claim claim=new Claim();
		claim.setBankAccountNumber(dto.getBankAccountNumber());
		claim.setBankName(dto.getBankName());
		claim.setBranchName(dto.getBranchName());
		claim.setClaimAmount(dto.getClaimAmount());
		claim.setIfscCode(dto.getIfscCode());
		claim.setDate(LocalDateTime.now());
		claim.setRemarks(dto.getRemarks());
		claim.setClaimStatus(ClaimStatus.PENDING.name());
		
		return claim;
	}
	public ClaimDto entityToDto(Claim claim) {
		ClaimDto claimDto=new ClaimDto();
		claimDto.setId(claim.getId());
		claimDto.setBankAccountNumber(claim.getBankAccountNumber());
		claimDto.setBankName(claim.getBankName());
		claimDto.setBranchName(claim.getBranchName());
		claimDto.setClaimAmount(claim.getClaimAmount());
		claimDto.setIfscCode(claim.getIfscCode());
		claimDto.setDate(claim.getDate());
		claimDto.setRemarks(claim.getRemarks());
		claimDto.setClaimStatus(claim.getClaimStatus());
		claimDto.setPolicy(insurancePolicyMapper.entityToDto(claim.getPolicy()));
		return claimDto;
	}
}
