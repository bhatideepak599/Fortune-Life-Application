package com.techlabs.app.dto;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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

//	@Pattern(regexp = "^[A-Za-z0-9]+$",
//			message = "House Number must contain alphanumeric characters only.")
	private String houseNumber;

//	@Pattern(regexp = "^[A-Za-z0-9]+$",
//			message = "Apartment must contain alphanumeric characters only.")
	private String apartment;

//	@NotEmpty(message = "City is required")
//	@Pattern(regexp = "^[A-Za-z]+$", message = "City name must contain only alphabetic characters.")
	private String city;

//	@NotEmpty(message = "State is required")
//	@Pattern(regexp = "^[A-Za-z]+$", message = "State name must contain only alphabetic characters.")
	private String state;

//	@Min(value = 100000, message = "Pincode must be at least 6 digits")
//	@Max(value = 999999, message = "Pincode cannot be more than 6 digits")
	private Integer pinCode;
}
