package com.techlabs.app.entity;

import com.techlabs.app.enums.DocumentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class SubmittedDocument {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    @NotBlank
    private String documentName=DocumentStatus.PENDING.name();
    
    @Column(nullable = false)
    @NotBlank
    private String documentStatus;

    @Column(nullable = false)
    @NotBlank
    private String documentImage;
}
