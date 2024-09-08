package com.techlabs.app.service;

import com.techlabs.app.dto.JWTAuthResponse;
import com.techlabs.app.dto.LoginDto;
import com.techlabs.app.dto.RegisterDto;

import com.techlabs.app.dto.UserDto;
import jakarta.servlet.http.HttpServletRequest;

public interface AuthService {
    JWTAuthResponse login(LoginDto loginDto);

    String register(RegisterDto registerDto, String role);
    Boolean validateUserToken(HttpServletRequest request, String forrole);

    UserDto getLoggedUser(HttpServletRequest request);
}
