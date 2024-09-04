package com.techlabs.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QueryDto {
    private Long id;
    private String title;
    private String question;
    private String answer;
    private String queryResponse;
    private Boolean active;
    private String email;
}
