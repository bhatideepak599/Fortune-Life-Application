package com.techlabs.app.entity;
import lombok.*;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

import com.techlabs.app.enums.TokenType;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Token {

	@Id
	@GeneratedValue
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
