package com.techlabs.app.controller;

import com.techlabs.app.dto.CityDto;
import com.techlabs.app.service.CityService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/fortuneLife/city")
public class CityController {
    @Autowired
    private CityService cityService;

    @Operation(summary = "Get all cities with state ID")
    @GetMapping("/{stateId}")
    public ResponseEntity<Set<CityDto>> getAllCitiesOfState(@PathVariable(name = "stateId") Long stateId) {
        Set<CityDto> cityDtoList = cityService.getAllCitiesByStateId(stateId);

        return new ResponseEntity<>(cityDtoList, HttpStatus.OK);
    }

    @Operation(summary = "Get Particular city with state ID")
    @GetMapping("/{stateId}/{id}")
    public ResponseEntity<CityDto> getCityByStateId(@PathVariable(name = "stateId") Long stateId,
                                                    @PathVariable(name = "id") Long id) {
        CityDto cityDto = cityService.getCityByStateId(stateId, id);

        return new ResponseEntity<>(cityDto, HttpStatus.OK);
    }

    @Operation(summary = "Add city to a state")
    @PostMapping("/{stateId}")
    public ResponseEntity<CityDto> addNewCity(@PathVariable(name = "stateId") Long stateId,
                                              @RequestBody CityDto cityDto) {
        CityDto newCityDto = cityService.addNewCity(stateId, cityDto);

        return new ResponseEntity<>(newCityDto, HttpStatus.OK);
    }

    @Operation(summary = "Update existing city")
    @PutMapping("/{stateId}")
    public ResponseEntity<CityDto> updateCity(@PathVariable(name = "stateId") Long stateId,
                                              @RequestBody CityDto cityDto) {
        CityDto updatedCityDto = cityService.updateCity(stateId, cityDto);

        return new ResponseEntity<>(updatedCityDto, HttpStatus.OK);
    }

    @Operation(summary = "Delete City by Id of State")
    @DeleteMapping("/{stateId}/{id}")
    public ResponseEntity<Object> deleteCity(@PathVariable(name = "stateId") Long stateId,
                                             @PathVariable(name = "id") Long id) {
        String message = cityService.deleteCity(stateId, id);

        return ResponseEntity.ok(message);
    }

    @Operation(summary = "Activate City by Id of State")
    @PutMapping("/activate/{stateId}/{id}")
    public ResponseEntity<Object> activateCity(@PathVariable(name = "stateId") Long stateId,
                                               @PathVariable(name = "id") Long id) {
        String message = cityService.activateCity(stateId, id);

        return ResponseEntity.ok(message);
    }

}
