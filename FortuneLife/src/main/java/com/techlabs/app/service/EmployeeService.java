package com.techlabs.app.service;

import com.techlabs.app.dto.EmployeeDto;
import com.techlabs.app.dto.UserDto;
import com.techlabs.app.util.PageResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

public interface EmployeeService {

	EmployeeDto addEmployee(@Valid EmployeeDto employeeDto, String role);

	PageResponse<EmployeeDto> getAllEmployees(Long id, String userName, String name, String mobileNumber, String email,
			Boolean active, int page, int size);

	EmployeeDto getEmployeeById(Long id);

	EmployeeDto updateEmployee(EmployeeDto employeeDto);

	String activateEmployee(Long id);

	String deleteEmployeeById(Long id);

	EmployeeDto getEmployeeByToken(HttpServletRequest request);

}
