package com.techlabs.app.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import com.techlabs.app.dto.AgentDto;
import com.techlabs.app.dto.UserDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
	private AuthService authService;

	public WithdrawalServiceImpl(AgentRepository agentRepository, WithdrawalRepository withdrawalRepository, AgentMapper agentMapper, AuthService authService) {
		this.agentRepository = agentRepository;
		this.withdrawalRepository = withdrawalRepository;
		this.agentMapper = agentMapper;
		this.authService = authService;
	}

	@Override
	public WithdrawalDto claimWithdrawal(Long id, Double amount,AgentDto agentDto) {
		Agent agent = agentRepository.findById(id).orElseThrow(() -> new AgentRelatedException("No Agent Found!."));
		if (!agent.getActive())
			throw new AgentRelatedException("No Agent Found!.");
		if (!agent.getVerified())
			throw new AgentRelatedException("Agent is Not Active!.");

		if (agent.getTotalCommission() < amount)
			throw new AgentRelatedException("Claim Amount Should be Less than Total Commission.");
		if(agentDto.getAccountNumber()==null || agentDto.getBankName()==null || agentDto.getIfscCode()==null) {
			throw new AgentRelatedException("Account Details Missing!.");
		}

		agent.setTotalCommission(agent.getTotalCommission() - amount);
		agent.setAccountNumber(agentDto.getAccountNumber());
		agent.setBankName(agentDto.getBankName());
		agent.setIfscCode(agentDto.getIfscCode());
		Withdrawal withdrawal = new Withdrawal();
		agentRepository.save(agent);
		withdrawal.setAmount(amount);
		withdrawal.setStatus(DocumentStatus.PENDING.name());
		
		
		withdrawal.setAgent(agent);
		withdrawal.setWithdrawalDate(LocalDateTime.now());
		withdrawal.setLeftCommission(agent.getTotalCommission());
		withdrawal = withdrawalRepository.save(withdrawal);

		return entityToDto(withdrawal);
	}

	private WithdrawalDto entityToDto(Withdrawal withdrawal) {
		WithdrawalDto withdrawalDto = new WithdrawalDto();
		withdrawalDto.setAmount(withdrawal.getAmount());
		withdrawalDto.setWithdrawalId(withdrawal.getId());
		withdrawalDto.setStatus(withdrawal.getStatus());
		withdrawalDto.setLeftCommission(withdrawal.getLeftCommission());
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

		String formattedDate = withdrawal.getWithdrawalDate().format(formatter);

		LocalDateTime dateTime = LocalDateTime.parse(formattedDate, formatter);
		withdrawalDto.setWithdrawalDate(dateTime);
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

		return new PageResponse<>(response, withdrawals.getNumber(), withdrawals.getNumberOfElements(),
				withdrawals.getTotalElements(), withdrawals.getTotalPages(), withdrawals.isLast());

	}

	@Override
	public String approveWithdrawal(Long id) {
		Withdrawal withdrawal=withdrawalRepository.findById(id)
				.orElseThrow(()-> new FortuneLifeException("No Request Found For WithDrawal!."));
		withdrawal.setStatus("APPROVED");
		withdrawalRepository.save(withdrawal);
		return "WithDrawal Approved";
	}

	@Override
	public String rejectWithdrawal(Long id) {
		Withdrawal withdrawal=withdrawalRepository.findById(id)
				.orElseThrow(()-> new FortuneLifeException("No Request Found For WithDrawal!."));
		withdrawal.setStatus("REJECTED");
		Agent agent=withdrawal.getAgent();
		agent.setTotalCommission(agent.getTotalCommission()+withdrawal.getAmount());
		withdrawal.setLeftCommission(agent.getTotalCommission());
		withdrawalRepository.save(withdrawal);
		agentRepository.save(agent);
		return "WithDrawal Rejected";
	}

	@Override
	public PageResponse<WithdrawalDto> getAllWithdrawalsOfAnAgent(Long id, String status, HttpServletRequest request, int page, int size) {
		UserDto user=authService.getLoggedUser(request);
		Long agentId=user.getId();
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

		return new PageResponse<>(response, withdrawals.getNumber(), withdrawals.getNumberOfElements(),
				withdrawals.getTotalElements(), withdrawals.getTotalPages(), withdrawals.isLast());
	}

}
