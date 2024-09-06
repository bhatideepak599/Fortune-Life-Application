package com.techlabs.app.entity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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
}
