package com.techlabs.app.service;

import com.techlabs.app.dto.CustomerDto;
import com.techlabs.app.dto.UserDto;
import com.techlabs.app.entity.Address;
import com.techlabs.app.entity.Customer;
import com.techlabs.app.entity.Role;
import com.techlabs.app.entity.User;
import com.techlabs.app.exception.APIException;
import com.techlabs.app.exception.AdminRelatedException;
import com.techlabs.app.exception.CustomerRelatedException;
import com.techlabs.app.mapper.CustomerMapper;
import com.techlabs.app.mapper.UserMapper;
import com.techlabs.app.repository.AddressRepository;
import com.techlabs.app.repository.CustomerRepository;
import com.techlabs.app.repository.RoleRepository;
import com.techlabs.app.repository.UserRepository;
import com.techlabs.app.security.JwtTokenProvider;
import com.techlabs.app.util.PageResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CustomerServiceImpl implements CustomerService {
    private CustomerRepository customerRepository;
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private UserMapper userMapper;
    private CustomerMapper customerMapper;
    private AddressRepository addressRepository;
    private PasswordEncoder passwordEncoder;
    private JwtTokenProvider jwtTokenProvider;


    public CustomerServiceImpl(CustomerRepository customerRepository, UserRepository userRepository,
                               RoleRepository roleRepository, UserMapper userMapper, CustomerMapper customerMapper,
                               AddressRepository addressRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        super();
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userMapper = userMapper;
        this.customerMapper = customerMapper;
        this.addressRepository = addressRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public CustomerDto addCustomer(UserDto userDto, String role) {

        if (!role.equalsIgnoreCase("ROLE_CUSTOMER")) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Role Should Be Customer Only!.");
        }

        Optional<User> checkUser =
                userRepository
                        .findUserByUsernameOrEmail(userDto.getUsername(),userDto.getEmail());

        if (checkUser.isPresent()){
            CustomerDto customerDto = new CustomerDto();
            customerDto.setId(checkUser.get().getId());
            return customerDto;
        }



        if (userRepository.existsUserByEmail(userDto.getEmail()))
            throw new APIException(HttpStatus.BAD_REQUEST, "Email  already exists!.");

        User user = userMapper.dtoToEntity(userDto);
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        Address address = addressRepository.save(user.getAddress());
        user.setAddress(address);
        user.setActive(true);

        Optional<Role> byName = roleRepository.findByRoleName("ROLE_CUSTOMER");
        if (byName.isEmpty()) {
            throw new RuntimeException("ROLE NOT FOUND ");
        }
        Set<Role> roles = new HashSet<>();
        roles.add(byName.get());
        user.setRoles(roles);

        User savedUser = userRepository.save(user);

        Customer customer = customerMapper.getCustomer(savedUser);
        customer.setActive(true);
        Customer savedCustomer = customerRepository.save(customer);

        return customerMapper.entityToDto(savedCustomer);

    }

    @Override
    public PageResponse<CustomerDto> getAllCustomers(Long id, String userName, String name, String mobileNumber,
                                                     String email, Boolean active, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Customer> customers = customerRepository.findByIdAndUserNameAndNameAndMobileNumberAndEmailAndActive(id,
                userName, name, mobileNumber, email, active, pageable);
        if (customers.getContent().isEmpty()) {

            throw new CustomerRelatedException(" No Customers  Found! ");
        }

        List<Customer> allCustomers = customers.getContent();
        List<CustomerDto> response = new ArrayList<>();
        for (Customer customer : allCustomers) {
            CustomerDto customerDto = customerMapper.entityToDto(customer);
            response.add(customerDto);
        }

        return new PageResponse<>(response, customers.getNumber(), customers.getNumberOfElements(),
                customers.getTotalElements(), customers.getTotalPages(), customers.isLast());
    }

    @Override
    public CustomerDto getCustomerById(Long id) {

        Optional<Customer> customerById = customerRepository.findById(id);
        if (customerById.isEmpty())
            throw new CustomerRelatedException("No Customer Found for Id " + id);

        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty() || !user.get().getActive()) {
            throw new AdminRelatedException("No Customer Found for Id: " + id);
        }

        Customer customer = customerById.get();
        customer.setId(id);
        customer.setUser(user.get());
        return customerMapper.entityToDto(customer);

    }

    @Override
    public CustomerDto updateCustomer(@Valid UserDto userDto) {
        // Check if the customer exists
        Optional<Customer> customerById = customerRepository.findById(userDto.getId());

        if (customerById.isEmpty() || !customerById.get().getActive()) {
            throw new CustomerRelatedException("No Customer Found for Id " + userDto.getId());
        }
        Customer customer=customerById.get();
        User user=customerById.get().getUser();
        User updatedUser = userMapper.dtoToEntity(userDto);

        if (userDto.getAddressDto() != null && userDto.getAddressDto().getId() != null) {
            Address address=user.getAddress();
            if (address==null) {
                throw new CustomerRelatedException("No Address Found for Address Id " + userDto.getAddressDto().getId());
            }
            address.setHouseNumber(userDto.getAddressDto().getHouseNumber());
            address.setApartment(userDto.getAddressDto().getApartment());
            address.setCity(userDto.getAddressDto().getCity());
            address.setState(userDto.getAddressDto().getState());
            address.setPinCode(userDto.getAddressDto().getPinCode());
            addressRepository.save(address);
            user.setAddress(address);

        } else {
            Address newAddress = new Address();
            newAddress.setHouseNumber(userDto.getAddressDto().getHouseNumber());
            newAddress.setApartment(userDto.getAddressDto().getApartment());
            newAddress.setCity(userDto.getAddressDto().getCity());
            newAddress.setState(userDto.getAddressDto().getState());
            newAddress.setPinCode(userDto.getAddressDto().getPinCode());

            // Save the new address
            newAddress = addressRepository.save(newAddress);
            user.setAddress(newAddress); // Set the new address to the user
        }
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setDateOfBirth(updatedUser.getDateOfBirth());
        user.setMobileNumber(updatedUser.getMobileNumber());
        user.setGender(updatedUser.getGender());
        user = userRepository.save(user);
        customer.setUser(user);
        return customerMapper.entityToDto(customer);
    }


    @Override
    public String activateCustomer(Long id) {
        Optional<Customer> customer = customerRepository.findById(id);
        if (customer.isEmpty()) {
            throw new CustomerRelatedException("No Customer Found for Id " + id);
        }
        if (customer.get().getActive()) {
            throw new CustomerRelatedException("Customer Is Already In Active State ");
        }
        Customer customerToActivate = customer.get();
        customerToActivate.setActive(true);
        customerRepository.save(customerToActivate);

        return "Customer Activated SuccessFully";
    }

    @Override
    public String deleteCustomerById(Long id) {
        Optional<Customer> customer = customerRepository.findById(id);
        if (customer.isEmpty() || !customer.get().getActive()) {
            throw new CustomerRelatedException("No Customer Found for Id " + id);
        }
        Customer custimerToDelete = customer.get();
        custimerToDelete.setActive(false);
        customerRepository.save(custimerToDelete);
        return "Customer Deleted SuccessFully";
    }

    @Override
    public CustomerDto getCustomerByToken(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        final String token = authHeader.substring(7);
        String username = jwtTokenProvider.getUsername(token);
        User user = userRepository.findUserByUsernameOrEmail(username, username)
                .orElseThrow(() -> new AdminRelatedException("No Admin Found!."));
        Customer customer = customerRepository.findById(user.getId())
                .orElseThrow(() -> new CustomerRelatedException("No Customer Found!."));
        if (!customer.getActive())
            throw new CustomerRelatedException("No Customer Found!.");

        return customerMapper.entityToDto(customer);

    }

}
