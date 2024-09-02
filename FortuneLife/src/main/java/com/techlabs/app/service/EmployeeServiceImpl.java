package com.techlabs.app.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.techlabs.app.dto.EmployeeDto;
import com.techlabs.app.entity.Address;
import com.techlabs.app.entity.Employee;
import com.techlabs.app.entity.Role;
import com.techlabs.app.entity.User;
import com.techlabs.app.exception.APIException;
import com.techlabs.app.exception.EmployeeRelatedExcetption;
import com.techlabs.app.mapper.EmployeeMapper;
import com.techlabs.app.mapper.UserMapper;
import com.techlabs.app.repository.AddressRepository;
import com.techlabs.app.repository.EmployeeRepository;
import com.techlabs.app.repository.RoleRepository;
import com.techlabs.app.repository.UserRepository;
import com.techlabs.app.util.PageResponse;

@Service
public class EmployeeServiceImpl implements EmployeeService {

	private UserRepository userRepository;
	private RoleRepository roleRepository;
	private UserMapper userMapper;
	private AddressRepository addressRepository;
	private PasswordEncoder passwordEncoder;
	private EmployeeRepository employeeRepository;
	private EmployeeMapper employeeMapper;

	public EmployeeServiceImpl(UserRepository userRepository, RoleRepository roleRepository, UserMapper userMapper,
			AddressRepository addressRepository, PasswordEncoder passwordEncoder, EmployeeRepository employeeRepository,
			EmployeeMapper employeeMapper) {
		super();
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.userMapper = userMapper;
		this.addressRepository = addressRepository;
		this.passwordEncoder = passwordEncoder;
		this.employeeRepository = employeeRepository;
		this.employeeMapper = employeeMapper;
	}

	@Override
	public EmployeeDto addEmployee(EmployeeDto employeeDto, String role) {
		if (!role.equalsIgnoreCase("ROLE_EMPLOYEE")) {
			throw new APIException(HttpStatus.BAD_REQUEST, "Role Should Be Employee Only!.");
		}
		if (userRepository.existsByUsername(employeeDto.getUserDto().getUsername()))
			throw new APIException(HttpStatus.BAD_REQUEST, "Username is already exists!.");

		if (userRepository.existsUserByEmail(employeeDto.getUserDto().getEmail()))
			throw new APIException(HttpStatus.BAD_REQUEST, "Email  already exists!.");

		Employee employee = employeeMapper.dtoToEntity(employeeDto);
		User user = employee.getUser();
		user.setPassword(passwordEncoder.encode(employeeDto.getUserDto().getPassword()));

		Address address = addressRepository.save(user.getAddress());
		user.setAddress(address);
		user.setActive(true);

		Optional<Role> byName = roleRepository.findByRoleName("ROLE_CUSTOMER");
		if (byName.isEmpty()) {
			throw new RuntimeException("ROLE NOT FOUND ");
		}
		Set<Role> roles = new HashSet<>();
		roles.add(byName.get());
		user.setRoles(roles);

		User savedUser = userRepository.save(user);
		employee.setUser(savedUser);
		employee.setId(user.getId());
		employee.setJoiningDate(LocalDate.now());

		employee = employeeRepository.save(employee);

		return employeeMapper.entityToDto(employee);

	}

	@Override
	public PageResponse<EmployeeDto> getAllEmployees(Long id, String userName, String name, String mobileNumber,
			String email, Boolean active, int page, int size) {

		Pageable pageable = PageRequest.of(page, size);
		Page<Employee> employees = employeeRepository.findByIdAndUserNameAndNameAndMobileNumberAndEmailAndActive(id,
				userName, name, mobileNumber, email, active, pageable);
		if (employees.getContent().isEmpty()) {

			throw new EmployeeRelatedExcetption(" No employees  Found! ");
		}

		List<Employee> allemployees = employees.getContent();
		List<EmployeeDto> response = new ArrayList<>();
		for (Employee employee : allemployees) {
			EmployeeDto EmployeeDto = employeeMapper.entityToDto(employee);
			response.add(EmployeeDto);
		}

		return new PageResponse<>(response, employees.getNumber(), employees.getNumberOfElements(),
				employees.getTotalElements(), employees.getTotalPages(), employees.isLast());
	}

	@Override
	public EmployeeDto getEmployeeById(Long id) {
		Employee employee = employeeRepository.findById(id)
				.orElseThrow(() -> new EmployeeRelatedExcetption("No Employee Found With Employee Id :" + id));
		if (employee.getActive() == false)
			new EmployeeRelatedExcetption("No Employee Found With Employee Id :" + id);

		return employeeMapper.entityToDto(employee);

	}

	@Override
	public EmployeeDto updateEmployee(EmployeeDto employeeDto) {
		Employee employee = employeeRepository.findById(employeeDto.getId()).orElseThrow(
				() -> new EmployeeRelatedExcetption("No Employee Found With Employee Id :" + employeeDto.getId()));

		if (employee.getActive() == false)
			new EmployeeRelatedExcetption("No Employee Found With Employee Id :" + employeeDto.getId());

		User user = userMapper.dtoToEntity(employeeDto.getUserDto());
		Address address = user.getAddress();
		address = addressRepository.save(address);
		user.setAddress(address);
		user.setPassword(passwordEncoder.encode(employee.getUser().getPassword()));
		user.setId(employee.getUser().getId());
		user = userRepository.save(user);

		employee.setSalary(employee.getSalary());

		employee = employeeRepository.save(employee);

		return employeeMapper.entityToDto(employee);
	}

	@Override
	public String activateEmployee(Long id) {
		Employee employee = employeeRepository.findById(id)
				.orElseThrow(() -> new EmployeeRelatedExcetption("No Employee Found With Employee Id :" + id));

		if (employee.getActive())
			new EmployeeRelatedExcetption(" Employee is Already Active. ");
		employee.setActive(true);
		employeeRepository.save(employee);
		return "Employee Activated Successfully.";
	}

	@Override
	public String deleteEmployeeById(Long id) {
		Employee employee = employeeRepository.findById(id)
				.orElseThrow(() -> new EmployeeRelatedExcetption("No Employee Found With Employee Id :" + id));

		if (employee.getActive() == false)
			new EmployeeRelatedExcetption("No Employee Found With Employee Id :" + id);
		employee.setActive(false);
		employeeRepository.save(employee);
		return "Employee Deleted Successfully.";
	}

}
