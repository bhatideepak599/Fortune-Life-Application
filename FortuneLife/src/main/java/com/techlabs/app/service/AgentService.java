package com.techlabs.app.service;

import com.techlabs.app.dto.AgentDto;
import com.techlabs.app.util.PageResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

public interface AgentService {

	AgentDto addAgent(@Valid AgentDto agentDto, String role);

	PageResponse<AgentDto> getAllAgents(Long id, String userName, String name, String mobileNumber, String email,
			 Boolean active,Boolean verified, int page, int size);

	AgentDto getAgentById(Long id);

	AgentDto updateAgent( AgentDto agentDto);

	String activateAgent(Long id);

	String deleteAgentById(Long id);

	AgentDto getLoggedAgent(HttpServletRequest request);

}
