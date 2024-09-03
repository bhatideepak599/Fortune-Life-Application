package com.techlabs.app.entity;

import jakarta.persistence.*;
import lombok.*;

import com.techlabs.app.enums.TokenType;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Token {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;


    @Column(unique = true)
    public String token;

    @Enumerated(EnumType.STRING)
    public TokenType tokenType = TokenType.BEARER;

    public Boolean revoked;

    public Boolean expired;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
