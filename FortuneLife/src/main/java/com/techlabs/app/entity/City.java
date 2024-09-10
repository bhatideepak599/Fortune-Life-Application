package com.techlabs.app.entity;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class City {

    @Id
    @Column(nullable = false, unique = true)
    private Long pincode;

    @Column(nullable = false)
    private String name;

    private Boolean active;

    @ManyToOne
    @JoinColumn(name = "stateId", nullable = false)
    private State state;
    
    @ManyToMany(mappedBy = "cities", cascade = CascadeType.ALL)
    private Set<InsuranceScheme> schemes = new HashSet<>();
}
