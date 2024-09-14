package com.techlabs.app.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class Withdrawal {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime withdrawalDate;

    @Column(nullable = false)
    private Double amount;
    private Double leftCommission;
    @Column(nullable = false)
    private String status; 

    @ManyToOne
    @JoinColumn(name = "agent_id", nullable = false)
    private Agent agent;

}
