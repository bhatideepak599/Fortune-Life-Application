package com.techlabs.app.mapper;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.techlabs.app.dto.CustomerDto;
import com.techlabs.app.dto.InsurancePolicyResponseDto;
import com.techlabs.app.dto.UserDto;
import com.techlabs.app.entity.Customer;
import com.techlabs.app.entity.User;

@Component
public class CustomerMapper {
	@Autowired
	private UserMapper userMapper;
//	@Autowired
//	private InsurancePolicyMapper insurancePolicyMapper;

	public Customer getCustomer(User user) {
		Customer customer = new Customer();
		customer.setId(user.getId());
		customer.setUser(user);
		customer.setPolicies(new ArrayList<>());
		return customer;
	}

	public CustomerDto entityToDto(Customer customer) {
		CustomerDto customerDto = new CustomerDto();
		UserDto userDto = userMapper.entityToDto(customer.getUser());
		customerDto.setId(customer.getId());
		customerDto.setActive(customer.getActive());
		customerDto.setUserDto(userDto);

		
		//List<InsurancePolicyResponseDto> allPolicies=new ArrayList<>();
		
//		customer.getPolicies().forEach((policy)->allPolicies.add(insurancePolicyMapper.entityToDto(policy)) );
//		customerDto.setPolicies(allPolicies);

		return customerDto;
	}

}
