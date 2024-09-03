package com.techlabs.app.service;

import com.techlabs.app.dto.StateDto;
import com.techlabs.app.entity.State;
import com.techlabs.app.exception.FortuneLifeException;
import com.techlabs.app.mapper.CityMapper;
import com.techlabs.app.repository.CityRepository;
import com.techlabs.app.repository.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StateServiceImpl implements StateService {
    @Autowired
    private StateRepository stateRepository;

    @Autowired
    private CityMapper cityMapper;
    @Autowired
    private CityRepository cityRepository;

    @Override
    public List<StateDto> getAllStates() {
        List<State> states = stateRepository.findAll();
        if (states.isEmpty()) {
            throw new FortuneLifeException("There Are no states to found");
        }
        List<StateDto> stateDtoList = new ArrayList<>();
        for (State state : states) {
            StateDto stateDto = new StateDto();
            stateDto.setId(state.getId());
            stateDto.setName(state.getName());
            stateDto.setActive(state.getActive());
            stateDto.setCities(cityMapper.getDtoList(state.getCities()));
            stateDtoList.add(stateDto);
        }

        return stateDtoList;
    }

    @Override
    public StateDto getStateById(Long id) {
        State state = stateRepository.findById(id).orElseThrow(() -> new FortuneLifeException("There is no state with " +
                "ID : " + id));

        StateDto stateDto = new StateDto();
        stateDto.setId(state.getId());
        stateDto.setName(state.getName());
        stateDto.setActive(state.getActive());
        stateDto.setCities(cityMapper.getDtoList(state.getCities()));

        return stateDto;
    }

    @Override
    public StateDto addNewState(StateDto stateDto) {
        State state = new State();

        state.setName(stateDto.getName());
        state.setActive(stateDto.getActive());
        state.setCities(cityMapper.getEntityList(stateDto.getCities()));

        State newState = stateRepository.save(state);

        StateDto newStateDto = new StateDto();
        newStateDto.setId(newState.getId());
        newStateDto.setName(newState.getName());
        newStateDto.setActive(newState.getActive());
        newStateDto.setCities(cityMapper.getDtoList(newState.getCities()));

        return newStateDto;
    }

    @Override
    public StateDto updateState(StateDto stateDto) {
        State state = stateRepository.findById(stateDto.getId()).orElseThrow(() -> new FortuneLifeException("State " +
                "with ID : " + stateDto.getId() + " cannot be found"));

        if (!state.getActive()) {
            throw new FortuneLifeException("State with ID : " + stateDto.getId() + " is not active");
        }

        state.setName(stateDto.getName());
        state.setActive(stateDto.getActive());

        State updatedState = stateRepository.save(state);

        StateDto updatedStateDto = new StateDto();
        updatedStateDto.setName(updatedState.getName());
        updatedStateDto.setActive(updatedState.getActive());
        updatedStateDto.setId(updatedStateDto.getId());
        updatedStateDto.setCities(cityMapper.getDtoList(updatedState.getCities()));

        return updatedStateDto;
    }

    @Override
    public String deleteState(Long id) {
        State state = stateRepository.findById(id).orElseThrow(() -> new FortuneLifeException("State " +
                "with ID : " + id + " cannot be found"));

        if (!state.getActive()) {
            throw new FortuneLifeException("State with ID : " + id + " is not active");
        }

        state.setActive(false);
        stateRepository.save(state);
        return "State with ID : " + id + " deleted successfully";
    }

    @Override
    public String activateState(Long id) {
        State state = stateRepository.findById(id).orElseThrow(() -> new FortuneLifeException("State " +
                "with ID : " + id + " cannot be found"));

        if (state.getActive()) {
            throw new FortuneLifeException("State with ID : " + id + " is already active");
        }

        state.setActive(true);
        stateRepository.save(state);
        return "State with ID : " + id + " activated successfully";
    }
}
