package com.techlabs.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
	private String username;

	private String password;

	@NotBlank
	private String firstName;
	
	private String gender;
	private Boolean active;
	private String lastName;

	@NotBlank
	private String mobileNumber;

	@NotBlank
	@Email
	private String email;

	//@NotBlank
	private LocalDate dateOfBirth;

	private AddressDto addressDto;

}
