package com.techlabs.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SchemeDto {
    
	private Long id;

    @NotBlank
    private String SchemeName;

    private SchemeDetailsDto schemeDetails;

    //private List<InsurancePolicyResponseDto> policies;
    private Set<CityDto> citiesDto;

    private Boolean active;
}
