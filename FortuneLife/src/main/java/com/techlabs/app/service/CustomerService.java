package com.techlabs.app.service;

import com.techlabs.app.dto.CustomerDto;
import com.techlabs.app.dto.UserDto;
import com.techlabs.app.util.PageResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

public interface CustomerService {

	CustomerDto addCustomer( UserDto userDto, String role);

	PageResponse<CustomerDto> getAllCustomers(Long id, String userName, String name, String mobileNumber, String email,
			Boolean active, int page, int size);

	CustomerDto getCustomerById(Long id);

	CustomerDto updateCustomer(@Valid UserDto userDto);

	String activateCustomer(Long id);

	String deleteCustomerById(Long id);

	CustomerDto getCustomerByToken(HttpServletRequest request);
	
}
