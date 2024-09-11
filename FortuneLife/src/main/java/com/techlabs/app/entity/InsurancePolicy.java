package com.techlabs.app.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.techlabs.app.enums.PolicyStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;
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
public class InsurancePolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate issueDate = LocalDate.now();

    @Column(nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate maturityDate;

    @Column(nullable = false)
    @NotBlank
    private String premiumType;

    @Column(nullable = false)
    @PositiveOrZero(message = "Amount Should be Greater than Zero")
    private Double sumAssured;

    @Column(nullable = false)
    @PositiveOrZero(message = "Amount Should be Greater than Zero")
    private Double premiumAmount;

    @Column(nullable = false)
    private String policyStatus = PolicyStatus.PENDING.name();

    @Column(nullable = false)
    private Double paidPolicyAmountTillDate = 0D;

    @Column(nullable = false)
    private Double totalPolicyAmount = 0D;

    @Column(nullable = false)
    private Boolean verified = false;

    @ManyToOne(cascade = {CascadeType.ALL})
    @JoinColumn(name = "schemeId")
    private InsuranceScheme insuranceScheme;// scheme name

    @ManyToOne(cascade = {CascadeType.ALL})
    @JoinColumn(name = "agentId")
    private Agent agent; //agent

    @OneToMany(cascade = {CascadeType.ALL})
    private List<Nominee> nominees; //

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "insurancePolicy")
    private List<Payment> payments = new ArrayList<>(); //

    @OneToOne(cascade = {CascadeType.ALL})
    @JoinColumn(name = "claimId")
    private Claim claims; //

    @ManyToOne(cascade = {CascadeType.ALL})
    @JoinColumn(name = "customerId")
    private Customer customer;

    @OneToMany(cascade = {CascadeType.ALL})
    private Set<SubmittedDocument> submittedDocuments = new HashSet<>();//
}
