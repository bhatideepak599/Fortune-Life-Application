package com.techlabs.app.dto;

import java.time.LocalDate;
import java.util.Set;

import com.techlabs.app.entity.Address;
import com.techlabs.app.entity.Role;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

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
