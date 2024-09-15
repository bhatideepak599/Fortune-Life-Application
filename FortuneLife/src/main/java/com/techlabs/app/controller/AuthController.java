package com.techlabs.app.controller;

import com.techlabs.app.dto.*;
import com.techlabs.app.exception.UserRelatedException;
import com.techlabs.app.service.AuthService;
import com.techlabs.app.service.OtpService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/fortuneLife/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private OtpService otpService;
    private AuthService authService;
    private final LogoutHandler logoutHandler;


    public AuthController(OtpService otpService, AuthService authService, LogoutHandler logoutHandler) {
        super();
        this.otpService = otpService;
        this.authService = authService;
        this.logoutHandler = logoutHandler;
    }

    @Operation(summary = "User Login")
    @PostMapping(value = {"/login"})
    public ResponseEntity<JWTAuthResponse> login(@Valid @RequestBody LoginDto loginDto) {

        String role = loginDto.getRole().toUpperCase();

        if (role.equals("ADMIN") || role.equals("EMPLOYEE") || role.equals("CUSTOMER") || role.equals("AGENT")) {
            JWTAuthResponse jwtAuthResponse = authService.login(loginDto);
            return new ResponseEntity<>(jwtAuthResponse, HttpStatus.OK);
        } else throw new UserRelatedException("Invalid Role!. Login With Proper Role.");
    }



    @Operation(summary = "User Registration")
    @PostMapping(value = {"/register"})
    public ResponseEntity<UserDto> register(@Valid @RequestBody RegisterDto registerDto,
                                           @RequestParam(name = "tempRole") String tempRole) {
        String role = "ROLE_" + tempRole.toUpperCase();
        UserDto userDto = authService.register(registerDto, role);

        return ResponseEntity.ok(userDto);
    }

    @Operation(summary = "User Logout")
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {

        logoutHandler.logout(request, response, authentication);
        return new ResponseEntity<>("Successfully logged out", HttpStatus.OK);

    }
    
    @GetMapping("/user")
    public boolean validateUserToken(@RequestParam String role,HttpServletRequest request) {
    	 role = "ROLE_" + role.toUpperCase();
        return authService.validateUserToken(request,role);
    }

    @Operation(summary = "Send OTP")
    @GetMapping("/send-otp")
    public String sendOtp(@RequestParam String sourceType,@RequestParam String sourceValue) throws MessagingException {

        otpService.sendOtp(sourceType,sourceValue);

        return "OTP has been sent.";
    }

    @Operation(summary = "Get Logged user")
    @GetMapping("/loggedUser")
    public ResponseEntity<UserDto> getLoggedUser(HttpServletRequest request){
        UserDto userDto = authService.getLoggedUser(request);

        return new ResponseEntity<>(userDto,HttpStatus.OK);
    }

   
    @Operation(summary = "Forget Password")
    @PutMapping("/forget-Password")
    public ResponseEntity<String> forgetPassword(@RequestBody ForgetPassword forgetPassword){
        String message = authService.forgetPassWord(forgetPassword);

        return new ResponseEntity<>(message,HttpStatus.OK);
    }
    
    @Operation(summary = "Change Password")
    @PutMapping("/change-Password")
    public ResponseEntity<JWTAuthResponse> changePassword(@RequestBody UserDto userDto){
    	JWTAuthResponse message = authService.changePassword(userDto);

        return new ResponseEntity<>(message,HttpStatus.OK);
    }

}
