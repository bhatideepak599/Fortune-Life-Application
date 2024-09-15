package com.techlabs.app.service;

import com.techlabs.app.dto.*;

import jakarta.servlet.http.HttpServletRequest;

public interface AuthService {
    JWTAuthResponse login(LoginDto loginDto);

    UserDto register(RegisterDto registerDto, String role);
    Boolean validateUserToken(HttpServletRequest request, String forrole);

    UserDto getLoggedUser(HttpServletRequest request);

	JWTAuthResponse changePassword(UserDto userDto);

    String forgetPassWord(ForgetPassword forgetPassword);
}
