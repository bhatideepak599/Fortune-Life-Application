package com.techlabs.app.entity;

import com.techlabs.app.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String paymentType;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private LocalDateTime paymentDate = LocalDateTime.now();

    private Double tax;

    private Double totalPayment;

    @ManyToOne
    @JoinColumn(name = "policy_id", nullable = false)
    private InsurancePolicy insurancePolicy;

    @Column(nullable = false)
    private String paymentStatus = PaymentStatus.UNPAID.name();
}
