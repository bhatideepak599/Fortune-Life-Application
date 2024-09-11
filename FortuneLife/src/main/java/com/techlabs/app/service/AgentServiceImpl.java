package com.techlabs.app.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.techlabs.app.dto.AgentDto;
import com.techlabs.app.entity.Address;
import com.techlabs.app.entity.Agent;
import com.techlabs.app.entity.Role;
import com.techlabs.app.entity.User;
import com.techlabs.app.exception.APIException;
import com.techlabs.app.exception.AgentRelatedException;
import com.techlabs.app.mapper.AgentMapper;
import com.techlabs.app.mapper.UserMapper;
import com.techlabs.app.repository.AddressRepository;
import com.techlabs.app.repository.AgentRepository;
import com.techlabs.app.repository.RoleRepository;
import com.techlabs.app.repository.UserRepository;
import com.techlabs.app.util.PageResponse;
import jakarta.validation.Valid;

@Service
public class AgentServiceImpl implements AgentService {
	private AgentRepository agentRepository;
	private AgentMapper agentMapper;
	private UserRepository userRepository;
	private RoleRepository roleRepository;
	private UserMapper userMapper;
	private AddressRepository addressRepository;
	private PasswordEncoder passwordEncoder;

	public AgentServiceImpl(AgentRepository agentRepository, AgentMapper agentMapper, UserRepository userRepository,
			RoleRepository roleRepository, UserMapper userMapper, AddressRepository addressRepository,
			PasswordEncoder passwordEncoder) {
		super();
		this.agentRepository = agentRepository;
		this.agentMapper = agentMapper;
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.userMapper = userMapper;
		this.addressRepository = addressRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public AgentDto addAgent(@Valid AgentDto agentDto, String role) {
		if (!role.equalsIgnoreCase("ROLE_AGENT")) {
			throw new APIException(HttpStatus.BAD_REQUEST, "Role Should Be Agent Only!.");
		}
		if (userRepository.existsByUsername(agentDto.getUserDto().getUsername()))
			throw new APIException(HttpStatus.BAD_REQUEST, "Username is already exists!.");

		if (userRepository.existsUserByEmail(agentDto.getUserDto().getEmail()))
			throw new APIException(HttpStatus.BAD_REQUEST, "Email  already exists!.");

		Agent agent = agentMapper.dtoToEntity(agentDto);

		User user = agent.getUser();
		user.setPassword(passwordEncoder.encode(agentDto.getUserDto().getPassword()));
		if (user.getAddress() != null) {
			Address address = addressRepository.save(user.getAddress());
			user.setAddress(address);
		}
		user.setActive(true);

		Optional<Role> byName = roleRepository.findByRoleName("ROLE_AGENT");
		if (byName.isEmpty()) {
			throw new RuntimeException("ROLE NOT FOUND ");
		}
		Set<Role> roles = new HashSet<>();
		roles.add(byName.get());
		user.setRoles(roles);

		user = userRepository.save(user);
		agent.setId(user.getId());
		agent.setUser(user);
		agent.setVerified(false);
		if (agentDto.getVerified())
			agent.setVerified(true);
		agent.setWithdrawals(new ArrayList<>());
		agent.setImage(agentDto.getImage());
		agent = agentRepository.save(agent);
		return agentMapper.entityToDto(agent);
	}

	@Override
	public PageResponse<AgentDto> getAllAgents(Long id, String userName, String name, String mobileNumber, String email,
			Boolean active, Boolean verified, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		Page<Agent> agents = agentRepository.findByIdAndUserNameAndNameAndMobileNumberAndEmailAndActive(id, userName,
				name, mobileNumber, email, active, verified, pageable);
		if (agents.getContent().isEmpty()) {

			throw new AgentRelatedException(" No Agents  Found! ");
		}

		List<Agent> allAgents = agents.getContent();
		List<AgentDto> response = new ArrayList<>();
		for (Agent agent : allAgents) {
			AgentDto agentDto = agentMapper.entityToDto(agent);
			agentDto.setTotalTransactions(agent.getCommissions().size());
			response.add(agentDto);
		}

		return new PageResponse<>(response, agents.getNumber(), agents.getNumberOfElements(), agents.getTotalElements(),
				agents.getTotalPages(), agents.isLast());

	}

	@Override
	public AgentDto getAgentById(Long id) {
		Agent agent = agentRepository.findById(id)
				.orElseThrow(() -> new AgentRelatedException("No Agent Found With Agent ID:" + id));

		if (agent.getActive() == false)
			throw new AgentRelatedException("No Agent Found With Agent ID:" + id);

		return agentMapper.entityToDto(agent);
	}

	@Override
	public AgentDto updateAgent(AgentDto agentDto) {
		// System.out.println("agentDto->"+agentDto+"===========================================================================================================");
		Agent agent = agentRepository.findById(agentDto.getId())
				.orElseThrow(() -> new AgentRelatedException("No Agent Found With Agent ID:" + agentDto.getId()));

		if (agent.getActive() == false)
			throw new AgentRelatedException("No Agent Found With Agent ID:" + agentDto.getId());

		User user = userMapper.dtoToEntity(agentDto.getUserDto());
		Address address = user.getAddress();
		address.setId(agent.getUser().getAddress().getId());
		address = addressRepository.save(address);
		user.setAddress(address);
		user.setPassword(passwordEncoder.encode(agent.getUser().getPassword()));
		user.setId(agentDto.getUserDto().getId());
		user = userRepository.save(user);

		agent.setUser(user);
		agent.setId(agentDto.getId());
	
			agent.setActive(true);
		
			agent.setVerified(true);
		agent = agentRepository.save(agent);

		return agentMapper.entityToDto(agent);
	}

	@Override
	public String activateAgent(Long id) {
		Agent agent = agentRepository.findById(id)
				.orElseThrow(() -> new AgentRelatedException("No Agent Found With Agent ID:" + id));

		if (agent.getActive())
			throw new AgentRelatedException("Agent Is Already Active");

		agent.setActive(true);
		agent = agentRepository.save(agent);

		return "Agent Activated Successfully.";
	}

	@Override
	public String deleteAgentById(Long id) {
		Agent agent = agentRepository.findById(id)
				.orElseThrow(() -> new AgentRelatedException("No Agent Found With Agent ID:" + id));

		if (agent.getActive() == false)
			throw new AgentRelatedException("No Agent Found With Id: " + id);

		agent.setActive(false);
		agent = agentRepository.save(agent);

		return "Agent Deleted Successfully.";
	}

}
