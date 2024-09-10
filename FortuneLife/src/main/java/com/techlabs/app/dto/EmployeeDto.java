package com.techlabs.app.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class EmployeeDto {

	private Long id;
	private Boolean active;
	@PositiveOrZero(message = "Amount Should be Greater than Zero")
	private Double salary;
	private LocalDate joiningDate = LocalDate.now();
	private UserDto userDto;
	
	
}
