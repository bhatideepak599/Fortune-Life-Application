package com.techlabs.app.service;

import com.techlabs.app.dto.JWTAuthResponse;
import com.techlabs.app.dto.LoginDto;
import com.techlabs.app.dto.RegisterDto;
import com.techlabs.app.entity.*;
import com.techlabs.app.enums.Gender;
import com.techlabs.app.enums.TokenType;
import com.techlabs.app.exception.AdminRelatedException;
import com.techlabs.app.exception.AgentRelatedException;
import com.techlabs.app.exception.CustomerRelatedException;
import com.techlabs.app.exception.EmployeeRelatedExcetption;
import com.techlabs.app.exception.UserRelatedException;
import com.techlabs.app.repository.*;
import com.techlabs.app.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    private AuthenticationManager authenticationManager;
    private PasswordEncoder passwordEncoder;
    private JwtTokenProvider jwtTokenProvider;
    private RoleRepository roleRepository;
    private UserRepository userRepository;
    private AdminRepository adminRepository;
    private EmployeeRepository employeeRepository;
    private AgentRepository agentRepository;
    private CustomerRepository customerRepository;
    private AddressRepository addressRepository;
    private TokenRepository tokenRepository;

    public AuthServiceImpl(AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder,
                           JwtTokenProvider jwtTokenProvider, RoleRepository roleRepository, UserRepository userRepository,
                           AdminRepository adminRepository, EmployeeRepository employeeRepository, AgentRepository agentRepository,
                           CustomerRepository customerRepository, AddressRepository addressRepository,
                           TokenRepository tokenRepository) {
        super();
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.employeeRepository = employeeRepository;
        this.agentRepository = agentRepository;
        this.customerRepository = customerRepository;
        this.addressRepository = addressRepository;
        this.tokenRepository = tokenRepository;
    }


    @Override
    public JWTAuthResponse login(LoginDto loginDto) {
        User user = userRepository
                .findUserByUsernameOrEmail(loginDto.getUsernameOrEmail(), loginDto.getUsernameOrEmail())
                .orElseThrow(() -> new UserRelatedException(
                        "User with username or email " + loginDto.getUsernameOrEmail() + " cannot be found"));

        if (!user.getActive()) {
            throw new UserRelatedException("User is not active");
        }



        if (loginDto.getRole().equalsIgnoreCase("ADMIN")) {
            Admin admin = adminRepository.findByUserDetails(user).orElseThrow(() -> new AdminRelatedException(
                    "Admin with username or email " + loginDto.getUsernameOrEmail() + " cannot be found"));

            if (!admin.getActive()) {
                throw new AdminRelatedException("Admin is not active");
            }
        }

        if (loginDto.getRole().equalsIgnoreCase("EMPLOYEE")) {
            Employee employee = employeeRepository.findByUser(user).orElseThrow(() -> new EmployeeRelatedExcetption(
                    "Employee with username or email " + loginDto.getUsernameOrEmail() + " cannot be found"));

            if (!employee.getActive()) {
                throw new EmployeeRelatedExcetption("Employee is not active");
            }
        }

        if (loginDto.getRole().equalsIgnoreCase("AGENT")) {
            Agent agent = agentRepository.findByUser(user).orElseThrow(() -> new AgentRelatedException(
                    "Agent with username or email " + loginDto.getUsernameOrEmail() + " cannot be found"));

            if (!agent.getActive()) {
                throw new AgentRelatedException("Agent is not active");
            }
        }

        if (loginDto.getRole().equalsIgnoreCase("CUSTOMER")) {
            Customer customer = customerRepository.findByUser(user).orElseThrow(() -> new CustomerRelatedException(
                    "Customer with username or email " + loginDto.getUsernameOrEmail() + " cannot be found"));

            if (!customer.getActive()) {
                throw new CustomerRelatedException("Customer is not active");
            }
        }

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);
        saveToken(user, token);
        JWTAuthResponse jwtAuthResponse = new JWTAuthResponse();
        jwtAuthResponse.setAccessToken(token);

        for (Role newRole : user.getRoles()) {
            jwtAuthResponse.setRole(newRole.getRoleName());
            break;
        }

        return jwtAuthResponse;
    }

    @Override
    public String register(RegisterDto registerDto, String role) {

        if (userRepository.existsUserByUsername(registerDto.getUsername()) && role.equals("ROLE_ADMIN")) {

            throw new CustomerRelatedException(
                    "Admin with the Username : " + registerDto.getUsername() + " already exists");
        }

        if (userRepository.existsUserByUsername(registerDto.getUsername()) && role.equals("ROLE_AGENT")) {

            throw new CustomerRelatedException(
                    "Agent with the Username : " + registerDto.getUsername() + " already " + "exists");
        }

        if (userRepository.existsUserByUsername(registerDto.getUsername()) && role.equals("ROLE_CUSTOMER")) {

            throw new AdminRelatedException(
                    "Customer with the Username : " + registerDto.getUsername() + " already exists");
        }

        User user = new User();
        user.setFirstName(registerDto.getFirstName());
        user.setLastName(registerDto.getLastName());
        user.setUsername(registerDto.getUsername());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setMobileNumber(registerDto.getMobileNumber());
        user.setEmail(registerDto.getEmail());
        user.setDateOfBirth(registerDto.getDateOfBirth());

        if (Gender.MALE.name().equalsIgnoreCase(registerDto.getGender())) {
            user.setGender(Gender.MALE.name());
        } else if (Gender.FEMALE.name().equalsIgnoreCase(registerDto.getGender())) {
            user.setGender(Gender.FEMALE.name());
        } else {
            user.setGender(Gender.OTHERS.name());
        }

        Set<Role> roles = new HashSet<>();
        Role newRole = roleRepository.findByRoleName(role).orElseThrow(() -> new RuntimeException("Role Not Found"));
        roles.add(newRole);
        user.setRoles(roles);

        User savedUser = userRepository.save(user);

        if (role.equals("ROLE_ADMIN")) {
            Admin admin = new Admin();
            admin.setId(savedUser.getId());
            admin.setUserDetails(savedUser);
            adminRepository.save(admin);
        }

        if (role.equals("ROLE_AGENT")) {
            List<Claim> claims = new ArrayList<>();
            List<Commission> commissions = new ArrayList<>();
            Agent agent = new Agent();
            agent.setId(savedUser.getId());
            agent.setUser(savedUser);
            agent.setClaims(claims);
            agent.setCommissions(commissions);
            agentRepository.save(agent);
        }

        if (role.equals("ROLE_CUSTOMER")) {
            List<InsurancePolicy> policies = new ArrayList<>();
            Customer customer = new Customer();
            customer.setId(savedUser.getId());
            customer.setPolicies(policies);
            customer.setUser(savedUser);
            customerRepository.save(customer);
        }

        return "Registration successful for role : " + role.substring(5);
    }

    private Token saveToken(User user, String jwtToken) {
        Token token = new Token();
        if (user.getToken() != null) {
            token.setId(user.getToken().getId());
        }
        token.setToken(jwtToken);
        token.setUser(user);
        token.setRevoked(false);
        token.setExpired(false);
        token.setTokenType(TokenType.BEARER);
        tokenRepository.save(token);

        return token;

    }

}
