package com.techlabs.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@ToString
@AllArgsConstructor
public class UserDto {
	private Long id;
	@NotBlank
	@Pattern(regexp = "^(?=.*[A-Za-z0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]+$",
			message = "Username must contain alphanumeric characters and at least one special character.")
	private String username;

	@NotBlank
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$",
			message = "Password must be at least 8 characters long, and contain one uppercase letter, one lowercase letter, one number, and one special character.")
	private String password;

	@NotBlank
	//@Pattern(regexp = "^[A-Za-z]+$", message = "First name must contain only alphabetic characters.")
	private String firstName;


	@Pattern(regexp = "Male|Female|Others|MALE|FEMALE|OTHERS", message = "Gender must be 'Male', 'Female', or " +
			"'Others'.")
	private String gender;
	private Boolean active;

	@Pattern(regexp = "^[A-Za-z]+$", message = "Last name must contain only alphabetic characters.")
	private String lastName;

	@NotBlank
	@Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be a valid 10-digit number.")
	private String mobileNumber;

	@NotBlank
	@Email(message = "Email should be in a proper format.")
	private String email;

	@Past(message = "Date of birth cannot be in the future.")
	private LocalDate dateOfBirth;

	private AddressDto addressDto;

}
