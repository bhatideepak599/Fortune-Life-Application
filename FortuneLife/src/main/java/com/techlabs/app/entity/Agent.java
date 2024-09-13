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
public class Agent {
    @Id
    private Long id;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    private Boolean verified = false;
    private Double totalCommission = 0.0;
    private String image;
    private String bankName;
    private String accountNumber;
    private String ifscCode;

    @OneToMany(cascade = {CascadeType.ALL})
    private List<Commission> commissions;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "UserId")
    private User user;

    @OneToMany(cascade = {CascadeType.ALL})
    private List<Claim> claims;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "agent")
    private List<Withdrawal> withdrawals;
}
