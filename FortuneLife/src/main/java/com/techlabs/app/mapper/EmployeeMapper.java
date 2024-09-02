package com.techlabs.app.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.techlabs.app.dto.EmployeeDto;
import com.techlabs.app.dto.UserDto;
import com.techlabs.app.entity.Employee;
import com.techlabs.app.entity.User;

@Component
public class EmployeeMapper {
	@Autowired
	private UserMapper userMapper;

	public Employee dtoToEntity(EmployeeDto employeeDto) {
		Employee employee = new Employee();
		employee.setActive(true);
		employee.setSalary(employeeDto.getSalary());
		User user = userMapper.dtoToEntity(employeeDto.getUserDto());
		employee.setUser(user);
		return employee;
	}

	public EmployeeDto entityToDto(Employee employee) {
		EmployeeDto employeeDto = new EmployeeDto();

		employeeDto.setActive(employee.getActive());
		employeeDto.setId(employee.getId());
		employeeDto.setJoiningDate(employee.getJoiningDate());
		employeeDto.setSalary(employee.getSalary());

		UserDto userDto = userMapper.entityToDto(employee.getUser());
		employeeDto.setUserDto(userDto);

		return employeeDto;
	}
}
