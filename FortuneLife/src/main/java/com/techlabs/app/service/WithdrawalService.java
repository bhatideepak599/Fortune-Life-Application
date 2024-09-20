package com.techlabs.app.service;

import com.techlabs.app.dto.AgentDto;
import com.techlabs.app.dto.WithdrawalDto;
import com.techlabs.app.util.PageResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface WithdrawalService {

	WithdrawalDto claimWithdrawal(Long id, Double amount, AgentDto agentDto);

	PageResponse<WithdrawalDto> getAllWithdrawalRequests(Long id, Long agentId, String status, int page, int size);

	String approveWithdrawal(Long id, String remarks);

	String rejectWithdrawal(Long id, String remarks);

    PageResponse<WithdrawalDto> getAllWithdrawalsOfAnAgent(Long id, String status, HttpServletRequest request, int page, int size);
}
