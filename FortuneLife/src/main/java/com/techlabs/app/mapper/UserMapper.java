package com.techlabs.app.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.techlabs.app.dto.AddressDto;
import com.techlabs.app.dto.UserDto;
import com.techlabs.app.entity.Address;
import com.techlabs.app.entity.User;
import com.techlabs.app.enums.Gender;

@Component
public class UserMapper {

	@Autowired
	private AddressMapper addressMapper;

	public User dtoToEntity(UserDto userDto) {
		User user = new User();

		user.setFirstName(userDto.getFirstName());
		user.setLastName(userDto.getLastName());
		user.setDateOfBirth(userDto.getDateOfBirth());
		user.setEmail(userDto.getEmail());
		user.setMobileNumber(userDto.getMobileNumber());
		user.setUsername(userDto.getUsername());
		if (userDto.getGender().equalsIgnoreCase("male")) {
			user.setGender(Gender.MALE.name());
		} else if (userDto.getGender().equalsIgnoreCase("female")) {
			user.setGender(Gender.FEMALE.name());
		} else {
			user.setGender(Gender.OTHERS.name());
		}
		if(userDto.getAddressDto()!=null) {
		Address address = addressMapper.dtoToEntity(userDto.getAddressDto());
		user.setAddress(address);
	}
		return user;
	}

	public UserDto entityToDto(User user) {
		UserDto userDto = new UserDto();
		userDto.setId(user.getId());
		userDto.setFirstName(user.getFirstName());
		userDto.setLastName(user.getLastName());
		userDto.setDateOfBirth(user.getDateOfBirth());
		userDto.setGender(user.getGender());
		userDto.setEmail(user.getEmail());
		userDto.setMobileNumber(user.getMobileNumber());
		userDto.setUsername(user.getUsername());
		userDto.setActive(user.getActive());
		userDto.setPassword("Not Available");
		if (user.getAddress() != null) {
			AddressDto addressDto = addressMapper.entityToDto(user.getAddress());
			userDto.setAddressDto(addressDto);
		}

		return userDto;
	}

}
