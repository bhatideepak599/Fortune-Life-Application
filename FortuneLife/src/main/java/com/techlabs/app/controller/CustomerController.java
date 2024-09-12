package com.techlabs.app.controller;

import com.techlabs.app.dto.CustomerDto;
import com.techlabs.app.dto.InsurancePolicyDto;
import com.techlabs.app.dto.InsurancePolicyResponseDto;
import com.techlabs.app.dto.UserDto;
import com.techlabs.app.service.CustomerService;
import com.techlabs.app.service.InsurancePolicyService;
import com.techlabs.app.util.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fortuneLife/customer")
public class CustomerController {
	private static final Logger logger = LoggerFactory.getLogger(CustomerController.class);
	@Autowired
	private CustomerService customerService;
	@Autowired
	private InsurancePolicyService insurancePolicyService;

	@Operation(summary = "Add A New Customer ")
	@PostMapping
	public ResponseEntity<CustomerDto> addCustomer(@Valid @RequestBody UserDto userDto,
			@RequestParam(name = "role") String name) {
		logger.info("Adding A New Customer");
		String role = "ROLE_" + name.toUpperCase();
		CustomerDto customerDto = customerService.addCustomer(userDto, role);

		return new ResponseEntity<>(customerDto, HttpStatus.OK);
	}

	@Operation(summary = "Get All Customer based on Search Criteria")
	@GetMapping
	public ResponseEntity<PageResponse<CustomerDto>> getAllCustomers(@RequestParam(required = false) Long id,
			@RequestParam(required = false) String userName, @RequestParam(required = false) String name,
			@RequestParam(required = false) String mobileNumber, @RequestParam(required = false) String email,
			@RequestParam(required = false) Boolean active,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size) {
		logger.info("Fetching All The Customers");
		PageResponse<CustomerDto> customers = customerService.getAllCustomers(id, userName, name, mobileNumber, email,
				active, page, size);

		return new ResponseEntity<>(customers, HttpStatus.OK);
	}

	@Operation(summary = "Fetch Customer By Id")
	@GetMapping("/{id}")
	public ResponseEntity<CustomerDto> getCustomerById(@PathVariable("id") Long id) {
		logger.info("Fetching A Customer");
		CustomerDto customerDto = customerService.getCustomerById(id);
		return new ResponseEntity<>(customerDto, HttpStatus.OK);
	}

	@Operation(summary = "Update A  Customer")
	@PutMapping
	public ResponseEntity<CustomerDto> updateCustomer(@Valid @RequestBody UserDto userDto) {
		logger.info("Updating A Customer");
		CustomerDto customerDto = customerService.updateCustomer(userDto);
		return new ResponseEntity<>(customerDto, HttpStatus.OK);
	}

	@Operation(summary = "Activate A Customer")
	@PutMapping("/activate/{id}")
	public ResponseEntity<String> activateCustomer(@PathVariable("id") Long id) {
		logger.info("Activating A Customer");
		String activatedMessage = customerService.activateCustomer(id);
		return new ResponseEntity<>(activatedMessage, HttpStatus.OK);
	}

	@Operation(summary = "Delete Customer By Id")
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteCustomerById(@PathVariable("id") Long id) {
		logger.info("Deleting A Customer with Customer Id");
		String message = customerService.deleteCustomerById(id);

		return new ResponseEntity<>(message, HttpStatus.OK);
	}

	// Add A Policy for the customer
	@Operation(summary = "Buy New Policy Under A Scheme By A Logged Customer Without Agent ")
	@PostMapping("/{customerId}/Insurance-Scheme/{schemeId}/policy")
	public ResponseEntity<InsurancePolicyResponseDto> addNewPolicy(@PathVariable(name = "customerId") Long customerId,
			@PathVariable(name = "schemeId") Long schemeId, @Valid @RequestBody InsurancePolicyDto insurancePolicyDto) {
		
		 logger.info("New Policy For The Customer ");
		 InsurancePolicyResponseDto addedPolicy=insurancePolicyService.addNewPolicy(customerId,schemeId,insurancePolicyDto);
		 return new ResponseEntity<>(addedPolicy, HttpStatus.OK);
	}
	
	@Operation(summary = "Buy New Policy Under A Scheme By Agent To Customer")
	@PostMapping("/{customerId}/Insurance-Scheme/{schemeId}/agent/{agentId}/policy")
	public ResponseEntity<InsurancePolicyResponseDto> addNewPolicyByAgentForCustomer(@PathVariable(name = "customerId") Long customerId,
			@PathVariable(name = "schemeId") Long schemeId, @PathVariable(name = "agentId") Long agentId,
			@Valid @RequestBody InsurancePolicyDto insurancePolicyDto) {
		
		 logger.info("New Policy For The Customer ");
		 InsurancePolicyResponseDto addedPolicy=insurancePolicyService.addNewPolicyByAgentForCustomer(customerId,schemeId,agentId,insurancePolicyDto);
		 return new ResponseEntity<>(addedPolicy, HttpStatus.OK);
	}
	
	@Secured("CUSTOMER")
	   @Operation(summary = "Fetch Logged Customer By Token")
	    @GetMapping("/logged")
	    public ResponseEntity<CustomerDto> getCustomerByToken(HttpServletRequest request) {
	        logger.info("Fetching A Customer");
	        CustomerDto admin = customerService.getCustomerByToken(request);
	        return new ResponseEntity<>(admin, HttpStatus.OK);
	    }

	
}
