package com.techlabs.app.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
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

	@NotEmpty(message = "City is required")
	@Column(nullable = false)
	private String city;

	@NotEmpty(message = "State is required")
	@Column(nullable = false)
	private String state;

	//@Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be a 6-digit number")
	@Column(nullable = false)
	private Integer pinCode;

}
