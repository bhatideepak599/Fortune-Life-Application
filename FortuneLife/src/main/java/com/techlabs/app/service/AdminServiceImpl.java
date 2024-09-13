package com.techlabs.app.service;

import java.util.ArrayList;
import java.lang.Override;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.techlabs.app.entity.*;
import com.techlabs.app.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.techlabs.app.dto.AdminDto;
import com.techlabs.app.dto.UserDto;
import com.techlabs.app.exception.APIException;
import com.techlabs.app.exception.AdminRelatedException;
import com.techlabs.app.mapper.UserMapper;
import com.techlabs.app.security.JwtTokenProvider;
import com.techlabs.app.util.PageResponse;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private GlobalTaxRepository globalTaxRepository;

    private AdminRepository adminRepository;
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private UserMapper userMapper;
    private AddressRepository addressRepository;
    private JwtTokenProvider jwtTokenProvider;

    private PasswordEncoder passwordEncoder;

    public AdminServiceImpl(AdminRepository adminRepository, UserRepository userRepository,
                            RoleRepository roleRepository, UserMapper userMapper, AddressRepository addressRepository,
                            JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder) {
        super();
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userMapper = userMapper;
        this.addressRepository = addressRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AdminDto addAdmin(UserDto userDto, String role) {

        if (userRepository.existsByUsername(userDto.getUsername()))
            throw new APIException(HttpStatus.BAD_REQUEST, "Username is already exists!.");

        User user = userMapper.dtoToEntity(userDto);
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        Address address = addressRepository.save(user.getAddress());
        user.setAddress(address);
        user.setActive(true);

        Optional<Role> byName = roleRepository.findByRoleName(role);
        if (byName.isEmpty()) {
            throw new RuntimeException("ROLE NOT FOUND ");
        }
        Set<Role> roles = new HashSet<>();
        roles.add(byName.get());
        user.setRoles(roles);

        User savedUser = userRepository.save(user);

        Admin admin = new Admin();
        admin.setUserDetails(savedUser);
        admin.setId(savedUser.getId());
        admin.setActive(true);

        Admin savedAdmin = adminRepository.save(admin);
        AdminDto adminDto = new AdminDto();
        adminDto.setId(savedAdmin.getId());
        adminDto.setActive(savedAdmin.getActive());

        UserDto savedUserDto = userMapper.entityToDto(savedUser);
        adminDto.setUserDto(savedUserDto);

        return adminDto;

    }

    @Override
    public PageResponse<AdminDto> getAllAdmins(Long id, String userName, String name, String mobileNumber, String email,
                                               Boolean active, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Admin> admins = adminRepository.findByIdAndUserNameAndNameAndMobileNumberAndEmailAndActive(id, userName,
                name, mobileNumber, email, active, pageable);
        if (admins.getContent().isEmpty()) {

            throw new AdminRelatedException(" No Admin  Found ");
        }

        List<Admin> allAdmins = admins.getContent();
        List<AdminDto> response = new ArrayList<>();
        for (Admin admin : allAdmins) {
            User userDetails = admin.getUserDetails();

            AdminDto adminDto = new AdminDto();
            adminDto.setId(admin.getId());
            adminDto.setActive(admin.getActive());
            adminDto.setUserDto(userMapper.entityToDto(userDetails));
            response.add(adminDto);
        }

        return new PageResponse<>(response, admins.getNumber(), admins.getNumberOfElements(), admins.getTotalElements(),
                admins.getTotalPages(), admins.isLast());
    }

    @Override
    public AdminDto updateAdmin(UserDto userDto) {

        Optional<Admin> admin = adminRepository.findById(userDto.getId());
        if (admin.isEmpty() || admin.get().getActive() == false) {
            throw new AdminRelatedException("No Admin Found for Id " + userDto.getId());
        }
        Optional<User> user = userRepository.findById(userDto.getId());
        if (user.isEmpty() || user.get().getActive() == false) {
            throw new AdminRelatedException("No Admin Found for Id " + userDto.getId());
        }

//		Optional<Address> addressById = addressRepository.findById(userDto.getAddressDto().getId());
//		if (addressById.isEmpty()) {
//			throw new AdminRelatedException("No Address Found for Address Id " + userDto.getAddressDto().getId());
//		}
        // System.out.println(userDto);
        User userForUpdate = userMapper.dtoToEntity(userDto);
        userForUpdate.setToken(user.get().getToken());
        userForUpdate.setId(userDto.getId());
        userForUpdate.setRoles(user.get().getRoles());
        userForUpdate.setPassword(user.get().getPassword());
        Address address = userForUpdate.getAddress();
        if (userDto.getAddressDto() != null && user.get().getAddress() == null) {
            address = addressRepository.save(address);
        } else {
            address.setId(user.get().getAddress().getId());
            addressRepository.save(address);
        }


        // Debugging: Log before saving
        // System.out.println("Saving Address: " + address);


        // System.out.println("Saving User: " + userForUpdate);

        userForUpdate = userRepository.save(userForUpdate);

        AdminDto adminDto = new AdminDto();
        adminDto.setId(userDto.getId());
        adminDto.setActive(true);
        UserDto savedUserDto = userMapper.entityToDto(userForUpdate);
        adminDto.setUserDto(savedUserDto);

        return adminDto;
    }

    @Override
    public String deleteAdminById(Long id) {
        Optional<Admin> admin = adminRepository.findById(id);
        if (admin.isEmpty() || admin.get().getActive() == false) {
            throw new AdminRelatedException("No Admin Found for Id " + id);
        }

        Admin adminToDelete = admin.get();
        adminToDelete.setActive(false);
        adminRepository.save(adminToDelete);

        return "Admin Deleted SuccessFully";
    }

    @Override
    public String activateAdmin(Long id) {
        Optional<Admin> admin = adminRepository.findById(id);
        if (admin.isEmpty()) {
            throw new AdminRelatedException("No Admin Found for Id " + id);
        }
        if (admin.get().getActive()) {
            throw new AdminRelatedException(" Admin Is Already In Active State ");
        }

        Admin adminToActivate = admin.get();
        adminToActivate.setActive(true);
        adminRepository.save(adminToActivate);

        return "Admin Activated SuccessFully";

    }

    @Override
    public AdminDto getAdminById(Long id) {
        Optional<Admin> admin = adminRepository.findById(id);
        if (admin.isEmpty() || admin.get().getActive() == false) {
            throw new AdminRelatedException("No Admin Found for Id " + id);
        }
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty() || user.get().getActive() == false) {
            throw new AdminRelatedException("No Admin Found for Id " + id);
        }
        UserDto userDto = userMapper.entityToDto(user.get());
        AdminDto adminDto = new AdminDto();
        adminDto.setId(userDto.getId());
        adminDto.setActive(admin.get().getActive());
        adminDto.setUserDto(userDto);
        return adminDto;
    }

    @Override
    public AdminDto getAdminByToken(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        final String token = authHeader.substring(7);
        String username = jwtTokenProvider.getUsername(token);
        User user = userRepository.findUserByUsernameOrEmail(username, username)
                .orElseThrow(() -> new AdminRelatedException("No Admin Found!."));
        Admin admin = adminRepository.findById(user.getId())
                .orElseThrow(() -> new AdminRelatedException("No Admin Found!."));
        if (!admin.getActive())
            throw new AdminRelatedException("No Admin Found!.");

        UserDto userDto = userMapper.entityToDto(user);
        AdminDto adminDto = new AdminDto();
        adminDto.setId(userDto.getId());
        adminDto.setActive(admin.getActive());
        adminDto.setUserDto(userDto);
        return adminDto;

    }


}
