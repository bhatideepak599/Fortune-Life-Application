package com.techlabs.app.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.techlabs.app.dto.AgentDto;
import com.techlabs.app.dto.WithdrawalDto;
import com.techlabs.app.service.AgentService;
import com.techlabs.app.service.WithdrawalService;
import com.techlabs.app.util.PageResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/fortuneLife/agent")

public class AgentController {
	private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
	@Autowired
	private AgentService agentService;
	@Autowired
	private WithdrawalService withdrawalService;

	@Operation(summary = "Add A New Agent ")
	@PostMapping
	public ResponseEntity<AgentDto> addAgent(@Valid @RequestBody AgentDto AgentDto,
			@RequestParam(name = "role") String name) {
		logger.info("Adding A New Agent");
		String role = "ROLE_" + name.toUpperCase();
		AgentDto agent = agentService.addAgent(AgentDto, role);

		return new ResponseEntity<>(agent, HttpStatus.OK);
	}

	@Operation(summary = "Get All Agent based on Search Criteria")
	@GetMapping()
	public ResponseEntity<PageResponse<AgentDto>> getAllAgents(@RequestParam(required = false) Long id,
			@RequestParam(required = false) String userName, @RequestParam(required = false) String name,
			@RequestParam(required = false) String mobileNumber, @RequestParam(required = false) String email,
			@RequestParam(required = false) Boolean active, @RequestParam(required = false) Boolean verified,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size) {
		logger.info("Fetching All The Agents");
		PageResponse<AgentDto> agents = agentService.getAllAgents(id, userName, name, mobileNumber, email,
				active,verified, page, size);

		return new ResponseEntity<>(agents, HttpStatus.OK);
	}

	@Operation(summary = "Fetch Agent By Id")
	@GetMapping("/{id}")
	public ResponseEntity<AgentDto> getAgentById(@PathVariable("id") Long id) {
		logger.info("Fetching An Agent By Id");
		AgentDto agentDto = agentService.getAgentById(id);
		return new ResponseEntity<>(agentDto, HttpStatus.OK);
	}

	@Operation(summary = "Update An  Agent")
	@PutMapping
	public ResponseEntity<AgentDto> updateAgent(@RequestBody AgentDto agentDto) {
		
		logger.info("Updating An Agent");
		AgentDto updatedAgentDto = agentService.updateAgent(agentDto);
		return new ResponseEntity<>(updatedAgentDto, HttpStatus.OK);
	}

	@Operation(summary = "Activate An Agent")
	@PutMapping("/activate/{id}")
	public ResponseEntity<String> activateAgent(@PathVariable("id") Long id) {
		logger.info("Activating An Agent");
		String activatedMessage = agentService.activateAgent(id);
		return new ResponseEntity<>(activatedMessage, HttpStatus.OK);
	}

	@Operation(summary = "Delete Agent By Id")
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteAgentById(@PathVariable("id") Long id) {
		logger.info("Deleting An Agent with Agent Id");
		String message = agentService.deleteAgentById(id);

		return new ResponseEntity<>(message, HttpStatus.OK);
	}

	@Operation(summary = "Claim For Withdrawal ")
	@PutMapping("/withdrawal/{agentId}")
	public ResponseEntity<WithdrawalDto> claimWithdrawal(@PathVariable("agentId") Long id,
			@RequestParam(name = "amount") Double amount, @RequestBody AgentDto agentDto) {
		System.out.println(agentDto+"===========================================");
		
		logger.info("Claiming For Withdrawal");

		WithdrawalDto withdrawalDto = withdrawalService.claimWithdrawal(id, amount,agentDto);

		return new ResponseEntity<>(withdrawalDto, HttpStatus.OK);
	}

	@Operation(summary = "Approve Withdrawal ")
	@PutMapping("/withdrawal/approve/{id}")
	public ResponseEntity<Object> approveWithdrawal(@PathVariable("id") Long id) {
		logger.info("Approving  Withdrawal");

		String approve = withdrawalService.approveWithdrawal(id);

		return new ResponseEntity<>(approve, HttpStatus.OK);
	}

	@Operation(summary = "Reject Withdrawal ")
	@PutMapping("/withdrawal/reject/{id}")
	public ResponseEntity<Object> rejectWithdrawal(@PathVariable("id") Long id) {
		logger.info("Rejecting  Withdrawal");

		String reject = withdrawalService.rejectWithdrawal(id);

		return new ResponseEntity<>(reject, HttpStatus.OK);
	}

	@Operation(summary = "Get All Agents Withdrawal Requests")
	@GetMapping("/withdrawal-requests")
	public ResponseEntity<PageResponse<WithdrawalDto>> getAllWithdrawalRequests(@RequestParam(required = false) Long id,
			@RequestParam(required = false) Long agentId, @RequestParam(required = false) String status,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size) {
		logger.info("Fetching All The Agents Withdrawal Requests");
		if (status != null) {
			status = status.toUpperCase();
			if (status.charAt(0) == 'A')
				status = "APPROVED";
			else if (status.charAt(0) == 'R')
				status = "REJECTED";
			else if (status.charAt(0) == 'P')
				status = "PENDING";
		}

		PageResponse<WithdrawalDto> allWidrawals = withdrawalService.getAllWithdrawalRequests(id, agentId, status, page,
				size);

		return new ResponseEntity<>(allWidrawals, HttpStatus.OK);
	}
	
	@Secured("AGENT")
	@Operation(summary = "Get  All Withdrawls of an agent")
	@GetMapping("/allwithdrawal")
	public ResponseEntity<PageResponse<WithdrawalDto>> getAllWithdrawalsOfAnAgent(
			@RequestParam(required = false) Long id, @RequestParam(required = false) String status,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size, HttpServletRequest request) {
		logger.info("Fetching All The Agents Withdrawal Requests");
		if (status != null) {
			status = status.toUpperCase();
			if (status.charAt(0) == 'A')
				status = "APPROVED";
			else if (status.charAt(0) == 'R')
				status = "REJECTED";
			else if (status.charAt(0) == 'P')
				status = "PENDING";
		}

		PageResponse<WithdrawalDto> allWidrawals = withdrawalService.getAllWithdrawalsOfAnAgent(id, status, request,
				page, size);

		return new ResponseEntity<>(allWidrawals, HttpStatus.OK);
	}
	@Secured("AGENT")
	@Operation(summary = "Fetch Logged Agent  ")
	@GetMapping("/loggedAgent")
	public ResponseEntity<AgentDto> getLoggedAgent(HttpServletRequest request) {
		logger.info("Fetching A Logged Agent");
		AgentDto agentDto = agentService.getLoggedAgent(request);
		return new ResponseEntity<>(agentDto, HttpStatus.OK);
	}

}
