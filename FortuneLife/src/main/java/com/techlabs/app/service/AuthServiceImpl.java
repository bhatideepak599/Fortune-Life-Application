package com.techlabs.app.service;

import com.techlabs.app.dto.*;
import com.techlabs.app.entity.*;
import com.techlabs.app.enums.Gender;
import com.techlabs.app.enums.TokenType;
import com.techlabs.app.exception.*;
import com.techlabs.app.mapper.UserMapper;
import com.techlabs.app.repository.*;
import com.techlabs.app.security.JwtTokenProvider;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserMapper userMapper;

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
    private OtpRepository otpRepository;

    public AuthServiceImpl(OtpRepository otpRepository, TokenRepository tokenRepository, AddressRepository addressRepository, CustomerRepository customerRepository, AgentRepository agentRepository, EmployeeRepository employeeRepository, AdminRepository adminRepository, UserRepository userRepository, RoleRepository roleRepository, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, UserMapper userMapper) {
        this.otpRepository = otpRepository;
        this.tokenRepository = tokenRepository;
        this.addressRepository = addressRepository;
        this.customerRepository = customerRepository;
        this.agentRepository = agentRepository;
        this.employeeRepository = employeeRepository;
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userMapper = userMapper;
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
    public UserDto register(RegisterDto registerDto, String role) {

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

        if (role.equals("ROLE_EMPLOYEE")) {
            throw new FortuneLifeException("Employee cannot register himself");
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

        Address address = new Address();
        address.setPinCode(0);
        address.setCity("Please update your city");
        address.setState("Select State");
        user.setAddress(address);

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
            agent.setImage(registerDto.getAgentImage());
            agent.setVerified(false);
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

        return userMapper.entityToDto(savedUser);
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

    @Override
    public Boolean validateUserToken(HttpServletRequest request, String forrole) {
        final String authHeader = request.getHeader("Authorization");
        final String token = authHeader.substring(7);
        Token tokenObject = tokenRepository.findByToken(token).get();
        if (tokenObject == null || tokenObject.getExpired() || tokenObject.getRevoked())
            return false;
        String username = jwtTokenProvider.getUsername(token);
        Optional<User> byUsername = userRepository.findUserByUsernameOrEmail(username, username);
        if (byUsername.isEmpty())
            return false;
        Set<Role> roles = byUsername.get().getRoles();
        for (Role role : roles) {
            //System.out.println(role.getRoleName() + "==========================================================ROLENAME" + forrole);
            if (role.getRoleName().equalsIgnoreCase(forrole))
                return true;
        }

        return false;
    }

    @Override
    public UserDto getLoggedUser(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        final String token = authHeader.substring(7);

        Token tokenObject = tokenRepository.findByToken(token)
                .orElseThrow(() -> new FortuneLifeException("Token cannot be found"));

        if (tokenObject.getExpired() || tokenObject.getRevoked()) {
            throw new FortuneLifeException("Invalid Token");
        }

        String username = jwtTokenProvider.getUsername(token);
        User user = userRepository.findUserByUsernameOrEmail(username, username)
                .orElseThrow(() -> new UserRelatedException("User with username or email : " + username + " cannot be found"));

        return userMapper.entityToDto(user);
    }

    @Override
    public String forgetPassWord(ForgetPassword forgetPassword) {

        System.out.println(forgetPassword + "====================================");
        User user = userRepository
                .findUserByUsernameOrEmail(forgetPassword.getUserName(), forgetPassword.getUserName())
                .orElseThrow(() -> new UserRelatedException(
                        "User with username or email " + forgetPassword.getUserName() + " cannot be found"));

        if (!user.getActive()) {
            throw new UserRelatedException("User is not active");
        }
        if (forgetPassword.getSourceType().equalsIgnoreCase("mobileNumber")) {
            String mobileNumber = forgetPassword.getSourceValue();
            if (!user.getMobileNumber().equalsIgnoreCase(mobileNumber))
                throw new FortuneLifeException("No User Found With Mobile Number:" + mobileNumber);
        }

        if (forgetPassword.getSourceType().equalsIgnoreCase("email")) {
            String email = forgetPassword.getSourceValue();
            if (!user.getEmail().equalsIgnoreCase(email))
                throw new FortuneLifeException("No User Found With Email: " + email);
        }
        Otp otp = otpRepository.findById(forgetPassword.getSourceValue())
                .orElseThrow(() -> new FortuneLifeException("Invalid Email or Phone Number"));
        boolean check = otp.getOtpCode().equalsIgnoreCase(forgetPassword.getOtpReceived());
        if (!check) {
            otp.incrementAttemptCount();
            // otpRepository.delete(otp);
            throw new FortuneLifeException("Invalid Otp");
        }
        if (otp.hasExceededMaxAttempts()) {
            otpRepository.delete(otp);
            throw new FortuneLifeException("Limit Exceeded For Verification, Send Otp again");
        }
        if (otp.isExpired()) {
            otpRepository.delete(otp);
            throw new FortuneLifeException("Otp Expired");
        }
        otp.incrementAttemptCount();
        otpRepository.delete(otp);
        user.setPassword(passwordEncoder.encode(forgetPassword.getPassword()));
        userRepository.save(user);
        return "Password has been changed.";
    }

    @Override
    public JWTAuthResponse changePassword(UserDto userDto) {
        User user = userRepository
                .findUserByUsernameOrEmail(userDto.getUsername(), userDto.getEmail())
                .orElseThrow(() -> new UserRelatedException(
                        "User with username or email " + userDto.getUsername() + " cannot be found"));
        if (!user.getActive()) {
            throw new UserRelatedException("User is not active");
        }

        //First name coming here is actually entered current password set in front end
        boolean check = passwordEncoder.matches(userDto.getFirstName(), user.getPassword());

        if (!check) {
            throw new UserRelatedException("Wrong Current Password!");
        }
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        userRepository.save(user);

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), userDto.getPassword()));

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

}
