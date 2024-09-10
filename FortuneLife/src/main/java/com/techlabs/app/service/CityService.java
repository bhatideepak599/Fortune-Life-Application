package com.techlabs.app.service;

import com.techlabs.app.dto.CityDto;

import java.util.Set;

public interface CityService {
    Set<CityDto> getAllCitiesByStateId(Long stateId);

    CityDto getCityByStateId(Long stateId, Long id);

    CityDto addNewCity(Long stateId, CityDto cityDto);

    CityDto updateCity(Long stateId, CityDto cityDto);

    String deleteCity(Long stateId, Long id);

    String activateCity(Long stateId, Long id);

	String addSchemeToCity(Long schemeId, Long cityId);

	String removeSchemeFromCity(Long schemeId, Long pincode);
}
