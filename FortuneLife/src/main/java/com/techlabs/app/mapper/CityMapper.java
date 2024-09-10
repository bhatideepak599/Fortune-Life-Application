package com.techlabs.app.mapper;

import com.techlabs.app.dto.CityDto;
import com.techlabs.app.entity.City;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class CityMapper {
    public CityDto entityToDto(City city) {
        CityDto cityDto = new CityDto();
        cityDto.setPincode(city.getPincode());
        cityDto.setName(city.getName());
        cityDto.setActive(city.getActive());
        return cityDto;
    }

    public City dtoToEntity(CityDto cityDto) {
        City city = new City();
        city.setName(cityDto.getName());
        city.setActive(cityDto.getActive());

        return city;
    }

    public Set<City> getEntityList(Set<CityDto> cityDtoList) {
        Set<City> cities = new HashSet<>();
        for (CityDto cityDto : cityDtoList) {
            cities.add(dtoToEntity(cityDto));
        }

        return cities;
    }

    public Set<CityDto> getDtoList(Set<City> cities) {
        Set<CityDto> cityDtoList = new HashSet<>();
        for (City city : cities) {
            cityDtoList.add(entityToDto(city));
        }

        return cityDtoList;
    }
}
