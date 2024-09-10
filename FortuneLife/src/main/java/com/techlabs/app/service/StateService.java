package com.techlabs.app.service;


import com.techlabs.app.dto.StateDto;

import java.util.List;

public interface StateService {
    List<StateDto> getAllStates();

    StateDto getStateById(Long id);

    StateDto addNewState(StateDto stateDto);

    StateDto updateState(StateDto stateDto);

    String deleteState(Long id);

    String activateState(Long id);

//	String addSchemeToAState(Long schemeId, Long stateId);
//
//	String removeSchemeFromAState(Long schemeId, Long stateId);
}
