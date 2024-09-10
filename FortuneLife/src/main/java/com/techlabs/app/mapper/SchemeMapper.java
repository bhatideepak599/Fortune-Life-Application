package com.techlabs.app.mapper;

import com.techlabs.app.dto.CityDto;
import com.techlabs.app.dto.SchemeDto;
import com.techlabs.app.dto.StateDto;
import com.techlabs.app.entity.InsuranceScheme;
import com.techlabs.app.entity.State;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class SchemeMapper {

	@Autowired
	private SchemeDetailsMapper schemeDetailsMapper;
	@Autowired
	private CityMapper cityMapper;

	public InsuranceScheme dtoToEntity(SchemeDto schemeDto) {
		InsuranceScheme insuranceScheme = new InsuranceScheme();
		insuranceScheme.setActive(schemeDto.getActive());
		insuranceScheme.setSchemeName(schemeDto.getSchemeName());
		insuranceScheme.setSchemeDetails(schemeDetailsMapper.dtoToEntity(schemeDto.getSchemeDetails()));

		return insuranceScheme;
	}

	public SchemeDto entityToDto(InsuranceScheme insuranceScheme) {
		SchemeDto schemeDto = new SchemeDto();
		schemeDto.setId(insuranceScheme.getId());
		schemeDto.setActive(insuranceScheme.getActive());
		schemeDto.setSchemeName(insuranceScheme.getSchemeName());
		schemeDto.setSchemeDetails(schemeDetailsMapper.entityToDto(insuranceScheme.getSchemeDetails()));

		if (insuranceScheme.getCities() != null) {
			Set<CityDto> cities = insuranceScheme.getCities().stream().map(cityMapper::entityToDto)
					.collect(Collectors.toSet());
			schemeDto.setCitiesDto(cities);

		}
		else schemeDto.setCitiesDto(new HashSet<>());



		return schemeDto;
	}

	public List<InsuranceScheme> getEntityList(List<SchemeDto> schemes) {
		List<InsuranceScheme> insuranceSchemes = new ArrayList<>();
		for (SchemeDto schemeDto : schemes) {
			insuranceSchemes.add(dtoToEntity(schemeDto));
		}

		return insuranceSchemes;
	}

	public List<SchemeDto> getDtoList(List<InsuranceScheme> schemes) {
		List<SchemeDto> schemeDtoList = new ArrayList<>();
		for (InsuranceScheme insuranceScheme : schemes) {
			schemeDtoList.add(entityToDto(insuranceScheme));
		}

		return schemeDtoList;
	}
}
