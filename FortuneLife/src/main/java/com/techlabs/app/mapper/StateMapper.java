package com.techlabs.app.mapper;

import java.util.HashSet;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.techlabs.app.dto.CityDto;
import com.techlabs.app.dto.StateDto;
import com.techlabs.app.entity.State;

@Component
public class StateMapper {
	@Autowired
	private CityMapper cityMapper;
	public StateDto entityToDto(State state) {
		StateDto stateDto=new StateDto();
		stateDto.setActive(state.getActive());
		stateDto.setId(state.getId());
		stateDto.setName(state.getName());
		
		if(state.getCities()!=null) {
			 Set<CityDto> response = state.getCities().stream()
			            .map(cityMapper::entityToDto)
			           .collect(Collectors.toSet());
			 stateDto.setCities(response);
		}
		else stateDto.setCities(new HashSet<>());
		
		return stateDto;
	}
}
