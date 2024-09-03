package com.techlabs.app.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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
public class InsuranceScheme {
		@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @NotBlank(message = "Scheme name is required")
	    @Column(nullable = false)
	    private String schemeName;

	    @OneToOne(cascade = {CascadeType.ALL})
	    @JoinColumn(name = "schemeDetailsId")
	    private SchemeDetails schemeDetails;

	    @OneToMany(cascade = {CascadeType.ALL})
	    private List<InsurancePolicy> policies;
	   
	    private Boolean active=true;
}
