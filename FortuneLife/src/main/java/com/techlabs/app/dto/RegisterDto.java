package com.techlabs.app.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDto {

    @NotBlank
    @Pattern(regexp = "^[A-Za-z]+$", message = "First name must contain only alphabetic characters.")
    private String firstName;

    @NotBlank
    @Pattern(regexp = "^[A-Za-z]+$", message = "Last name must contain only alphabetic characters.")
    private String lastName;

    @NotBlank
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{6,}+$",
            message = "Username must contain alphanumeric characters and at least one special character.")
    private String username;

    @NotBlank
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$",
            message = "Password must be at least 8 characters long, and contain one uppercase letter, one lowercase letter, one number, and one special character.")
    private String password;

    @NotBlank
    @Email(message = "Email should be in a proper format.")
    private String email;

    @Pattern(regexp = "^[0-9]{10}$")
    private String mobileNumber;

    @NotBlank
    @Pattern(regexp = "MALE|FEMALE|OTHERS", message = "Gender must be 'MALE', 'FEMALE', or 'OTHERS'.")
    private String gender;

    private String agentImage;

    @NotNull
    @Past(message = "Date of birth cannot be in the future.")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;
}
