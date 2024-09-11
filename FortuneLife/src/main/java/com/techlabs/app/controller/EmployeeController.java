package com.techlabs.app.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.techlabs.app.dto.AdminDto;
import com.techlabs.app.dto.EmployeeDto;
import com.techlabs.app.service.EmployeeService;
import com.techlabs.app.util.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/fortuneLife/employee")
public class EmployeeController {

	private static final Logger logger = LoggerFactory.getLogger(EmployeeController.class);
	@Autowired
	private EmployeeService employeeService;

	@Operation(summary = "Add A New employee ")
	@PostMapping
	public ResponseEntity<EmployeeDto> addEmployee(@Valid @RequestBody EmployeeDto employeeDto,
			@RequestParam(name = "role") String name) {
		logger.info("Adding A New employee");
		String role = "ROLE_" + name.toUpperCase();
		EmployeeDto employee = employeeService.addEmployee(employeeDto, role);

		return new ResponseEntity<>(employee, HttpStatus.OK);
	}

	@Operation(summary = "Get All employee based on Search Criteria")
	@GetMapping()
	public ResponseEntity<PageResponse<EmployeeDto>> getAllEmployees(@RequestParam(required = false) Long id,
			@RequestParam(required = false) String userName, @RequestParam(required = false) String name,
			@RequestParam(required = false) String mobileNumber, @RequestParam(required = false) String email,
			@RequestParam(required = false) Boolean active, @RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size) {
		logger.info("Fetching All The Employees");
		PageResponse<EmployeeDto> employees = employeeService.getAllEmployees(id, userName, name, mobileNumber, email,
				active, page, size);

		return new ResponseEntity<>(employees, HttpStatus.OK);
	}

	@Operation(summary = "Fetch Employee By Id")
	@GetMapping("/{id}")
	public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable("id") Long id) {
		logger.info("Fetching A employee");
		EmployeeDto employeeDto = employeeService.getEmployeeById(id);
		return new ResponseEntity<>(employeeDto, HttpStatus.OK);
	}

	@Operation(summary = "Update An  Employee")
	@PutMapping
	public ResponseEntity<EmployeeDto> updateEmployee(@Valid @RequestBody EmployeeDto employeeDto) {
		logger.info("Updating An Employee");
		System.out.println(employeeDto+"  ===========================================================================================");
		EmployeeDto updatedEmployeeDto = employeeService.updateEmployee(employeeDto);
		return new ResponseEntity<>(updatedEmployeeDto, HttpStatus.OK);
	}

	@Operation(summary = "Activate An Employee")
	@PutMapping("/activate/{id}")
	public ResponseEntity<String> activateEmployee(@PathVariable("id") Long id) {
		logger.info("Activating An employee");
		String activatedMessage = employeeService.activateEmployee(id);
		return new ResponseEntity<>(activatedMessage, HttpStatus.OK);
	}

	@Operation(summary = "Delete Employee By Id")
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteEmployeeById(@PathVariable("id") Long id) {
		logger.info("Deleting A employee with employee Id");
		String message = employeeService.deleteEmployeeById(id);

		return new ResponseEntity<>(message, HttpStatus.OK);
	}

	@Secured("EMPLOYEE")
	@Operation(summary = "Fetch Logged Employee By Token")
	@GetMapping("/logged")
	public ResponseEntity<EmployeeDto> getEmployeeByToken(HttpServletRequest request) {
		logger.info("Fetching An Employee");
		EmployeeDto employee = employeeService.getEmployeeByToken(request);
		return new ResponseEntity<>(employee, HttpStatus.OK);
	}

}
