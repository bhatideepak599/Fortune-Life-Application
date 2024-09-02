package com.techlabs.app.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
public class Admin {
    @Id
    private Long id;
    
    
    @Column(nullable = false)
	private Boolean active = true;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "userId")
    private User userDetails;

}