package com.techlabs.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ForgetPassword {
    @NotBlank
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{6,}+$",
            message = "Username must contain alphanumeric characters and at least one special character.")
    private String userName;

    @NotBlank
    @Pattern(regexp = "phoneNumber|email", message = "Source Type must be 'phoneNumber' or 'email'.")
    private String sourceType;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$|^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$",
            message = "Source value must be a valid phone number or email address.")
    private String sourceValue;

    @NotBlank(message = "OTP is required.")
    @Size(min = 6, max = 6, message = "OTP must be exactly 6 digits.")
    @Pattern(regexp = "^[0-9]{6}$",
            message = "OTP must only contain digits.")
    private String otpReceived;

    @NotBlank(message = "Password is required.")
    @Size(min = 8, message = "Password must be at least 8 characters long.")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$",
            message = "Password must contain at least one letter, one number, and one special character.")
    private String password;

}
