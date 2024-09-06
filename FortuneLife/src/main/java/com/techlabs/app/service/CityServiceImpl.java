package com.techlabs.app.service;

import com.techlabs.app.dto.CityDto;
import com.techlabs.app.entity.City;
import com.techlabs.app.entity.State;
import com.techlabs.app.exception.FortuneLifeException;
import com.techlabs.app.mapper.CityMapper;
import com.techlabs.app.repository.CityRepository;
import com.techlabs.app.repository.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class CityServiceImpl implements CityService {
    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private CityMapper cityMapper;

    @Autowired
    private StateRepository stateRepository;


    @Override
    public Set<CityDto> getAllCitiesByStateId(Long stateId) {
        State state = stateRepository.findById(stateId).orElseThrow(() -> new FortuneLifeException("State cannot be " +
                "found with ID : " + stateId));
        if (!state.getActive()) {
            throw new FortuneLifeException("State with ID : " + stateId + " is not active");
        }

        Set<City> cities = cityRepository.findAllByStateId(stateId);
        if (cities.isEmpty()) {
            throw new FortuneLifeException("There are no cities to be found in state with ID : " + stateId);
        }

        return cityMapper.getDtoList(cities);
    }

    @Override
    public CityDto getCityByStateId(Long stateId, Long id) {
        State state = stateRepository.findById(stateId).orElseThrow(() -> new FortuneLifeException("State cannot be " +
                "found with ID : " + stateId));

        if (!state.getActive()) {
            throw new FortuneLifeException("State with ID : " + stateId + " is not active");
        }

        City city = cityRepository.findByStateIdAndPincode(stateId, id)
                .orElseThrow(() -> new FortuneLifeException("City with ID : " + id + " is not present in state with ID : " + stateId));

        return cityMapper.entityToDto(city);
    }

    @Override
    public CityDto addNewCity(Long stateId, CityDto cityDto) {
        State state = stateRepository.findById(stateId).orElseThrow(() -> new FortuneLifeException("State cannot be " +
                "found with ID : " + stateId));

        if (!state.getActive()) {
            throw new FortuneLifeException("State with ID : " + stateId + " is not active");
        }

        City city = cityMapper.dtoToEntity(cityDto);
        city.setState(state);
        City newCity = cityRepository.save(city);
        state.getCities().add(newCity);
        stateRepository.save(state);

        return cityMapper.entityToDto(newCity);
    }

    @Override
    public CityDto updateCity(Long stateId, CityDto cityDto) {
        State state = stateRepository.findById(stateId).orElseThrow(() -> new FortuneLifeException("State cannot be " +
                "found with ID : " + stateId));

        if (!state.getActive()) {
            throw new FortuneLifeException("State with ID : " + stateId + " is not active");
        }

        City city = cityMapper.dtoToEntity(cityDto);
        city.setPincode(cityDto.getId());
        City updatedCity = cityRepository.save(city);

        return cityMapper.entityToDto(updatedCity);
    }

    @Override
    public String deleteCity(Long stateId, Long id) {
        State state = stateRepository.findById(stateId).orElseThrow(() -> new FortuneLifeException("State cannot be " +
                "found with ID : " + stateId));

        if (!state.getActive()) {
            throw new FortuneLifeException("State with ID : " + stateId + " is not active");
        }

        City city = cityRepository.findByStateIdAndPincode(stateId, id)
                .orElseThrow(() -> new FortuneLifeException("City with ID : " + id + " is not present in state with ID : " + stateId));

        if (!city.getActive()) {
            throw new FortuneLifeException("City with ID : " + id + " is not active");
        }

        city.setActive(false);
        cityRepository.save(city);

        return "City with ID : " + id + " deleted successfully";
    }

    @Override
    public String activateCity(Long stateId, Long id) {
        State state = stateRepository.findById(stateId).orElseThrow(() -> new FortuneLifeException("State cannot be " +
                "found with ID : " + stateId));

        if (!state.getActive()) {
            throw new FortuneLifeException("State with ID : " + stateId + " is not active");
        }

        City city = cityRepository.findByStateIdAndPincode(stateId, id)
                .orElseThrow(() -> new FortuneLifeException("City with ID : " + id + " is not present in state with ID : " + stateId));

        if (city.getActive()) {
            throw new FortuneLifeException("City with ID : " + id + " is already active");
        }

        city.setActive(true);
        cityRepository.save(city);

        return "City with ID : " + id + " activated successfully";
    }
}
