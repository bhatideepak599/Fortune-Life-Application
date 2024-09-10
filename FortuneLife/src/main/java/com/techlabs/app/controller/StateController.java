package com.techlabs.app.controller;

import com.techlabs.app.dto.StateDto;
import com.techlabs.app.service.StateService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fortuneLife/state")
public class StateController {
	private static final Logger logger = LoggerFactory.getLogger(StateController.class);

	@Autowired
	private StateService stateService;

	@Operation(summary = "Get All states")
	@GetMapping
	public ResponseEntity<List<StateDto>> getAllStates() {
		logger.info("Fetching all states");

		List<StateDto> stateDtoList = stateService.getAllStates();
		return new ResponseEntity<>(stateDtoList, HttpStatus.OK);
	}

	@Operation(summary = "Get State by ID")
	@GetMapping("/{id}")
	public ResponseEntity<StateDto> getStateById(@PathVariable(name = "id") Long id) {
		logger.info("Fetching state by ID :{}", id);

		StateDto stateDto = stateService.getStateById(id);
		return new ResponseEntity<>(stateDto, HttpStatus.OK);
	}

	@Operation(summary = "Add new State")
	@PostMapping
	public ResponseEntity<StateDto> addNewState(@Valid @RequestBody StateDto stateDto) {
		logger.info("Adding new State");

		StateDto newState = stateService.addNewState(stateDto);
		return new ResponseEntity<>(newState, HttpStatus.OK);
	}

	@Operation(summary = "Update existing state")
	@PutMapping
	public ResponseEntity<StateDto> updateEistingState(@Valid @RequestBody StateDto stateDto) {
		logger.info("Updating existing state");

		StateDto updatedState = stateService.updateState(stateDto);
		return new ResponseEntity<>(updatedState, HttpStatus.OK);
	}

	@Operation(summary = "Delete existing state by ID")
	@DeleteMapping("/{id}")
	public ResponseEntity<Object> deleteState(@PathVariable(name = "id") Long id) {
		logger.info("Delete state with ID : {}", id);

		String message = stateService.deleteState(id);
		return new ResponseEntity<>(message, HttpStatus.OK);
	}

	@Operation(summary = "Activate State by ID")
	@PutMapping("/activate/{id}")
	public ResponseEntity<Object> activateState(@PathVariable(name = "id") Long id) {
		logger.info("Activate city with ID : {}", id);

		String message = stateService.activateState(id);
		return new ResponseEntity<>(message, HttpStatus.OK);
	}

//	@Operation(summary = "Add Scheme To a State")
//	@PutMapping("/{stateId}/scheme/{schemeId}")
//	public ResponseEntity<Object> addSchemeToAState(@PathVariable("schemeId") Long schemeId,
//			@PathVariable("stateId") Long stateId) {
//		logger.info("Adding  Scheme In a State");
//
//		String message = stateService.addSchemeToAState(schemeId,stateId);
//		return new ResponseEntity<>(message, HttpStatus.OK);
//	}
//	
//	@Operation(summary = "Remove Scheme from a State")
//	@DeleteMapping("/{stateId}/scheme/{schemeId}")
//	public ResponseEntity<Object> removeSchemeFromAState(@PathVariable("schemeId") Long schemeId,
//			@PathVariable("stateId") Long stateId) {
//		logger.info("Removing  Scheme In a State");
//
//		String message = stateService.removeSchemeFromAState(schemeId,stateId);
//		return new ResponseEntity<>(message, HttpStatus.OK);
//	}


}
