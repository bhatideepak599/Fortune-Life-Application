package com.techlabs.app.dto;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CustomerDto {
	private Long id;
	private Boolean active;
	private Boolean verified;
	private UserDto userDto;
	//private List<InsurancePolicyResponseDto> policies;

}
