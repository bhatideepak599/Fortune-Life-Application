package com.techlabs.app.mapper;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import com.techlabs.app.dto.AgentDto;
import com.techlabs.app.dto.UserDto;
import com.techlabs.app.entity.Agent;
import com.techlabs.app.entity.User;

@Configuration
public class AgentMapper {
	@Autowired
	private UserMapper userMapper;

	public Agent dtoToEntity(AgentDto agentDto) {
		Agent agent = new Agent();
		agent.setActive(true);
		agent.setTotalCommission(0.0);
		agent.setVerified(agentDto.getVerified());
		agent.setClaims(new ArrayList<>());
		agent.setCommissions(new ArrayList<>());
		User user = userMapper.dtoToEntity(agentDto.getUserDto());
		agent.setUser(user);
		return agent;
	}

	public AgentDto entityToDto(Agent agent) {
		AgentDto agentDto = new AgentDto();
		agentDto.setId(agent.getId());
		agentDto.setActive(agent.getActive());
		agentDto.setTotalCommission(agent.getTotalCommission());
		agentDto.setVerified(agent.getVerified());
		UserDto userDto = userMapper.entityToDto(agent.getUser());
		agentDto.setUserDto(userDto);
		return agentDto;
	}
}
