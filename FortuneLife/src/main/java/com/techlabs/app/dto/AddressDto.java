package com.techlabs.app.dto;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
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
public class AddressDto {
	private Long id;

	private String houseNumber;

	private String apartment;

	@NotEmpty(message = "City is required")
	private String city;

	@NotEmpty(message = "State is required")
	private String state;

	@Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be a 6-digit number")
	private Integer pinCode;
}
