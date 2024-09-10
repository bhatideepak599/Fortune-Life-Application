package com.techlabs.app.service;

import com.techlabs.app.dto.AdminDto;
import com.techlabs.app.dto.UserDto;
import com.techlabs.app.entity.GlobalTax;
import com.techlabs.app.util.PageResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;


public interface AdminService {

	AdminDto addAdmin( UserDto userDto, String role);

	PageResponse<AdminDto> getAllAdmins(Long id, String userName, String name, String mobileNumber, String email,
			Boolean active, int page, int size);

	AdminDto updateAdmin( UserDto userDto);

	String deleteAdminById(Long id);

	String activateAdmin(Long id);

	AdminDto getAdminById(Long id);

	AdminDto getAdminByToken(HttpServletRequest request);
}
