package com.techlabs.app.security;

import com.techlabs.app.entity.User;
import com.techlabs.app.exception.APIException;
import com.techlabs.app.exception.UserRelatedException;
import com.techlabs.app.repository.UserRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {
    @Value("${app.jwt-secret}")
    private String jwtSecret;

    @Value("${app-jwt-expiration-milliseconds}")
    private long jwtExpirationDate;

    @Autowired
    private UserRepository userRepository;

    public String generateToken(Authentication authentication) {
        String usernameOrEmail = authentication.getName();

        User user = userRepository.findUserByUsernameOrEmail(usernameOrEmail, usernameOrEmail).orElseThrow(() -> new UserRelatedException("User with username or Email " + usernameOrEmail + " cannot be found"));
        String username = user.getUsername();

        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + jwtExpirationDate);

        String token = Jwts.builder()
                .setSubject(username)
                .claim("roles", authentication.getAuthorities().stream()
                        .map(authority -> authority.getAuthority())
                        .collect(Collectors.toList()))
                .setIssuedAt(new Date())
                .setExpiration(expireDate)
                .signWith(key())
                .compact();

        return token;
    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String getUsername(String token) {
    	 Claims claims = Jwts.parser()
                 .setSigningKey(key())
                 .build()
                 .parseClaimsJws(token)
                 .getBody();
         String username = claims.getSubject();
         return username;
     }

     
     public boolean validateToken(String token){
         try{
             Jwts.parser()
                     .setSigningKey(key())
                     .build()
                     .parse(token);
             return true;
        } catch (MalformedJwtException ex) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            throw new APIException(HttpStatus.BAD_REQUEST, "JWT claims string is empty.");
        }
    }
}
