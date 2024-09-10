package com.techlabs.app.entity;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
	    
	    private Boolean active=true;
	    @OneToMany(cascade = {CascadeType.ALL})
	    private List<InsurancePolicy> policies;
	   

	    
	    @ManyToMany(cascade = CascadeType.ALL)
	    @JoinTable(
	        name = "scheme_city",
	        joinColumns = @JoinColumn(name = "scheme_id"),
	        inverseJoinColumns = @JoinColumn(name = "city_id")
	    )
	    private Set<City> cities = new HashSet<>();
	    
}
