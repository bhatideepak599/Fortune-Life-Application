package com.techlabs.app.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Address {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String houseNumber;
	
	private String apartment;

//	@NotEmpty(message = "City is required")
//	@Pattern(regexp = "^[A-Za-z]+$", message = "City name must contain only alphabetic characters.")
//	@Column(nullable = false)
	private String city;

//	@NotEmpty(message = "State is required")
//	@Pattern(regexp = "^[A-Za-z]+$", message = "State name must contain only alphabetic characters.")
//	@Column(nullable = false)
	private String state;

	//@Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be a 6-digit number")
//	@Column(nullable = false)
//	@Min(value = 100000, message = "Pincode must be at least 6 digits")
//	@Max(value = 999999, message = "Pincode cannot be more than 6 digits")
	private Integer pinCode;

}
