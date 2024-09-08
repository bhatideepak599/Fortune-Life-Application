package com.techlabs.app.service;

import com.techlabs.app.dto.WithdrawalDto;
import com.techlabs.app.util.PageResponse;

public interface WithdrawalService {

	WithdrawalDto claimWithdrawal(Long id, Double amount);

	PageResponse<WithdrawalDto> getAllWithdrawalRequests(Long id, Long agentId, String status, int page, int size);

}
