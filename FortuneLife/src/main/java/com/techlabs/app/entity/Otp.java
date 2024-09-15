package com.techlabs.app.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table
@Data
public class Otp {
    @Id
    @Column(nullable = false, unique = true)
    private String source;

    // OTP code
    @Column(nullable = false, length = 6)
    private String otpCode;

    @Column(nullable = false)
    private LocalDateTime expirationTime;

    @Column(nullable = false)
    private int maxAttempts = 5;

    @Column(nullable = false)
    private int attemptCount = 0;

    @Column(nullable = false)
    private LocalDateTime createdTime;

    public void incrementAttemptCount() {
        this.attemptCount++;
    }
    public boolean hasExceededMaxAttempts() {
        return this.attemptCount >= this.maxAttempts;
    }
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expirationTime);
    }
}

