package com.techlabs.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StateDto {
    private Long id;

    private String name;

    private Boolean active;

    private Set<CityDto> cities;
}
