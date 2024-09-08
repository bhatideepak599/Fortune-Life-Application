package com.techlabs.app.mapper;

import org.springframework.stereotype.Component;

import com.techlabs.app.dto.AddressDto;
import com.techlabs.app.entity.Address;

@Component
public class AddressMapper {

	public Address dtoToEntity(AddressDto addressDto) {
		Address address=new Address();
		address.setCity(addressDto.getCity());
		address.setApartment(addressDto.getApartment());
		address.setHouseNumber(addressDto.getHouseNumber());
		address.setPinCode(addressDto.getPinCode());
		address.setState(addressDto.getState());
		
		return address;
	}

	public AddressDto entityToDto(Address address) {
		AddressDto addressDto=new AddressDto();
		addressDto.setId(address.getId());
		addressDto.setCity(address.getCity());
		if(address.getApartment()!=null)
		addressDto.setApartment(address.getApartment());
		if(address.getHouseNumber()!=null)
		addressDto.setHouseNumber(address.getHouseNumber());
		addressDto.setPinCode(address.getPinCode());
		addressDto.setState(address.getState());
		return addressDto;
	}

}
