package com.techlabs.app.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CityDto {
    @Min(value = 100000, message = "Pincode must be at least 6 digits")
    @Max(value = 999999, message = "Pincode cannot be more than 6 digits")
    private Long pincode;

    @Pattern(regexp = "^[A-Za-z]+$", message = "City name must contain only alphabetic characters.")
    private String name;

    private Boolean active;
}
