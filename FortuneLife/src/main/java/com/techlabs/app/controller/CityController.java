package com.techlabs.app.controller;

import com.techlabs.app.dto.CityDto;
import com.techlabs.app.service.CityService;
import io.swagger.v3.oas.annotations.Operation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/fortuneLife/city")
public class CityController {
    private static final Logger logger = LoggerFactory.getLogger(CityController.class);
    @Autowired
    private CityService cityService;

    @Operation(summary = "Get all cities with state ID")
    @GetMapping("/{stateId}")
    public ResponseEntity<Set<CityDto>> getAllCitiesOfState(@PathVariable(name = "stateId") Long stateId) {
        logger.info("Fetching all cities of state with ID : {}", stateId);

        Set<CityDto> cityDtoList = cityService.getAllCitiesByStateId(stateId);
        return new ResponseEntity<>(cityDtoList, HttpStatus.OK);
    }

    @Operation(summary = "Get Particular city with state ID")
    @GetMapping("/{stateId}/{id}")
    public ResponseEntity<CityDto> getCityByStateId(@PathVariable(name = "stateId") Long stateId,
                                                    @PathVariable(name = "id") Long id) {
        logger.info("Fetching a city with ID : {} of a state with ID : {}", id, stateId);

        CityDto cityDto = cityService.getCityByStateId(stateId, id);
        return new ResponseEntity<>(cityDto, HttpStatus.OK);
    }

    @Operation(summary = "Add city to a state")
    @PostMapping("/{stateId}")
    public ResponseEntity<CityDto> addNewCity(@PathVariable(name = "stateId") Long stateId,
                                              @RequestBody CityDto cityDto) {
        logger.info("Adding new city to state with ID : {}", stateId);

        CityDto newCityDto = cityService.addNewCity(stateId, cityDto);
        return new ResponseEntity<>(newCityDto, HttpStatus.OK);
    }

    @Operation(summary = "Update existing city")
    @PutMapping("/{stateId}")
    public ResponseEntity<CityDto> updateCity(@PathVariable(name = "stateId") Long stateId,
                                              @RequestBody CityDto cityDto) {
        logger.info("Update city of state with ID : {}", stateId);

        CityDto updatedCityDto = cityService.updateCity(stateId, cityDto);
        return new ResponseEntity<>(updatedCityDto, HttpStatus.OK);
    }

    @Operation(summary = "Delete City by Id of State")
    @DeleteMapping("/{stateId}/{id}")
    public ResponseEntity<Object> deleteCity(@PathVariable(name = "stateId") Long stateId,
                                             @PathVariable(name = "id") Long id) {
        logger.info("Deleting city with ID : {} of state with ID : {}", id, stateId);

        String message = cityService.deleteCity(stateId, id);
        return ResponseEntity.ok(message);
    }

    @Operation(summary = "Activate City by Id of State")
    @PutMapping("/activate/{stateId}/{id}")
    public ResponseEntity<Object> activateCity(@PathVariable(name = "stateId") Long stateId,
                                               @PathVariable(name = "id") Long id) {
        logger.info("Activating city with ID : {} of state with ID : {}", id, stateId);

        String message = cityService.activateCity(stateId, id);
        return ResponseEntity.ok(message);
    }
    
   // @Secured("ADMIN")
    @Operation(summary = "Add  A Scheme Into A City")
    @PutMapping("/{pincode}/scheme/{schemeId}")
    public ResponseEntity<Object> addSchemeToCity(@PathVariable(name = "pincode") Long pincode,
                                               @PathVariable(name = "schemeId") Long schemeId) {
        logger.info("Adding A Scheme Into A City");

        String message = cityService.addSchemeToCity(schemeId, pincode);
        return ResponseEntity.ok(message);
    }
    
   // @Secured("ADMIN")
    @Operation(summary = "Remove  A Scheme from A City")
    @DeleteMapping("/{pincode}/scheme/{schemeId}")
    public ResponseEntity<Object> removeSchemeFromCity(@PathVariable(name = "pincode") Long pincode,
                                               @PathVariable(name = "schemeId") Long schemeId) {
        logger.info("Removing A Scheme from A City");

        String message = cityService.removeSchemeFromCity(schemeId, pincode);
        return ResponseEntity.ok(message);
    }
    

}
