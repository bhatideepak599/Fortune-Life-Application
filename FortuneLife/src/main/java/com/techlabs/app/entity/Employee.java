package com.techlabs.app.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Employee {
	@Id
	private Long id;
	
	@Column(nullable = false)
	private Boolean active = true;

	@Column(nullable = false)
	@PositiveOrZero(message = "Amount Should be Greater than Zero")
	private Double salary;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate joiningDate = LocalDate.now();

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "userId")
	private User user;


}
