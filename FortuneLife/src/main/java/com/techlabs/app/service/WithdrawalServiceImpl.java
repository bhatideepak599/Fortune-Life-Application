package com.techlabs.app.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.techlabs.app.dto.AgentDto;
import com.techlabs.app.dto.WithdrawalDto;
import com.techlabs.app.entity.Agent;
import com.techlabs.app.entity.Withdrawal;
import com.techlabs.app.enums.DocumentStatus;
import com.techlabs.app.exception.AgentRelatedException;
import com.techlabs.app.exception.FortuneLifeException;
import com.techlabs.app.mapper.AgentMapper;
import com.techlabs.app.repository.AgentRepository;
import com.techlabs.app.repository.WithdrawalRepository;
import com.techlabs.app.util.PageResponse;

@Service
public class WithdrawalServiceImpl implements WithdrawalService {

	private AgentRepository agentRepository;
	private WithdrawalRepository withdrawalRepository;
	private AgentMapper agentMapper;

	public WithdrawalServiceImpl(AgentRepository agentRepository, WithdrawalRepository withdrawalRepository,
			AgentMapper agentMapper) {
		super();
		this.agentRepository = agentRepository;
		this.withdrawalRepository = withdrawalRepository;
		this.agentMapper = agentMapper;
	}

	@Override
	public WithdrawalDto claimWithdrawal(Long id, Double amount) {
		Agent agent = agentRepository.findById(id).orElseThrow(() -> new AgentRelatedException("No Agent Found!."));
		if (agent.getActive() == false)
			throw new AgentRelatedException("No Agent Found!.");
		if (agent.getVerified() == false)
			throw new AgentRelatedException("Agent is Not Active!.");
		
		if(agent.getTotalCommission()<amount) throw new AgentRelatedException("Claim Amount Should be Less than Total Commission.");

		Withdrawal withdrawal = new Withdrawal();
		withdrawal.setAmount(amount);
		withdrawal.setStatus(DocumentStatus.PENDING.name());
		withdrawal.setAgent(agent);
		withdrawal.setWithdrawalDate(LocalDateTime.now());

		withdrawal = withdrawalRepository.save(withdrawal);

		return entityToDto(withdrawal);
	}

	private WithdrawalDto entityToDto(Withdrawal withdrawal) {
		WithdrawalDto withdrawalDto = new WithdrawalDto();
		withdrawalDto.setAmount(withdrawal.getAmount());
		withdrawalDto.setId(withdrawal.getId());
		withdrawalDto.setStatus(withdrawal.getStatus());
		withdrawalDto.setWithdrawalDate(withdrawal.getWithdrawalDate());
		withdrawalDto.setAgentDto(agentMapper.entityToDto(withdrawal.getAgent()));

		return withdrawalDto;
	}

	@Override
	public PageResponse<WithdrawalDto> getAllWithdrawalRequests(Long id, Long agentId, String status, int page,
			int size) {
		Pageable pageable = PageRequest.of(page, size);
		Page<Withdrawal> withdrawals = withdrawalRepository.findByIdAndAgentIdAndStatus(id, agentId, status, pageable);
		if (withdrawals.getContent().isEmpty()) {

			throw new FortuneLifeException(" No Withdrawals  Found! ");
		}

		List<Withdrawal> allWithdrawals = withdrawals.getContent();
		List<WithdrawalDto> response = new ArrayList<>();
		for (Withdrawal withdrawal : allWithdrawals) {
			
			response.add(entityToDto(withdrawal));
		}

		return new PageResponse<>(response, withdrawals.getNumber(), withdrawals.getNumberOfElements(), withdrawals.getTotalElements(),
				withdrawals.getTotalPages(), withdrawals.isLast());
		
	}

}
