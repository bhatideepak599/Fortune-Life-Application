package com.techlabs.app.entity;

import java.util.HashSet;
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
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
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
public class SchemeDetails {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank
	private String schemeImage;

	@NotEmpty(message = "Description is required")
	@Column(nullable = false)
	private String description;

	@PositiveOrZero(message = "Minimum amount must be a non-negative number")
	@Column(nullable = false)
	private Double minAmount;

	@PositiveOrZero(message = "Maximum amount must be a non-negative number")
	@Column(nullable = false)
	private Double maxAmount;

	@PositiveOrZero(message = "Minimum investment time must be a non-negative number")
	@Column(nullable = false)
	private Integer minInvestmentTime;

	@PositiveOrZero(message = "Maximum investment time must be a non-negative number")
	@Column(nullable = false)
	private Integer maxInvestmentTime;

	@PositiveOrZero(message = "Minimum age must be a non-negative number")
	@Column(nullable = false)
	private Integer minAge;

	@PositiveOrZero(message = "Maximum age must be a non-negative number")
	@Column(name = "maxage")
	private Integer maxAge;

	@PositiveOrZero(message = "Profit ratio must be a non-negative number")
	@Column(nullable = false)
	private Double profitRatio;

	@PositiveOrZero(message = "Registration commission ratio must be a non-negative number")
	@Column(nullable = false)
	private Double registrationCommissionRatio;

	@PositiveOrZero(message = "Installment commission ratio must be a non-negative number")
	@Column(nullable = false)
	private Double installmentCommissionRatio;

	@ManyToMany(cascade = { CascadeType.ALL })
	@JoinTable(name="schemeDetail_documents" ,joinColumns = @JoinColumn(name = "detailsId"), inverseJoinColumns = @JoinColumn(name = "documentId"))
	private Set<SchemeDocument> documents = new HashSet<>();

}
