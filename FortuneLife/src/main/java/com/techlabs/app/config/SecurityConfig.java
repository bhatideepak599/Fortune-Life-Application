package com.techlabs.app.config;

import com.techlabs.app.security.JwtAuthenticationEntryPoint;
import com.techlabs.app.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationEntryPoint authenticationEntryPoint;

    @Autowired
    private JwtAuthenticationFilter authenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable()).cors(withDefaults()).authorizeHttpRequests(authorize -> authorize

                        // Swagger UI and API docs
                        .requestMatchers(HttpMethod.GET, "/swagger-ui/**", "/v3/api-docs/**", "/swagger-resources/**",
                                "/swagger-ui.html", "/webjars/**")
                        .permitAll()

                        // Authentication endpoints
                        .requestMatchers(HttpMethod.POST, "/fortuneLife/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/fortuneLife/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/fortuneLife/auth/logout").permitAll()
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/auth/user").permitAll()
                        .requestMatchers(HttpMethod.POST, "/fortuneLife/auth/verify-otp").permitAll()
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/auth/send-otp").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/auth/forget-Password").permitAll()
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/auth/loggedUser")
                        .hasAnyRole("ADMIN", "EMPLOYEE","CUSTOMER","AGENT")

                        .requestMatchers(HttpMethod.GET, "/fortuneLife/customer/Excel-Report/download").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/customer/pdf-Report/download").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/agent/Excel-Report/download").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/agent/pdf-Report/download").hasRole("ADMIN")

                        // Admin Endpoints
                        .requestMatchers(HttpMethod.POST, "/fortuneLife/admin").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/admin").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/admin/activate/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/fortuneLife/admin/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/admin").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/admin/logged").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/admin/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/claim").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/claim/approve/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/fortuneLife/tax/set-tax").hasRole("ADMIN")


                        // Employee Endpoints
                        .requestMatchers(HttpMethod.POST, "/fortuneLife/employee/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/employee").hasAnyRole("ADMIN", "EMPLOYEE")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/employee/activate/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/fortuneLife/employee/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/employee").hasAnyRole("ADMIN", "EMPLOYEE")
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/employee/{id}").hasAnyRole("ADMIN", "EMPLOYEE")

                        // Agent Endpoints
                        .requestMatchers(HttpMethod.POST, "/fortuneLife/agent").hasAnyRole("ADMIN", "EMPLOYEE")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/agent/withdrawal/{agentId}").hasRole("AGENT")
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/agent/withdrawal-requests").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/agent/allwithdrawal").hasRole("AGENT")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/agent/withdrawal/approve/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/agent/withdrawal/reject/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/agent").hasAnyRole("ADMIN","AGENT","EMPLOYEE")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/agent/activate/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/fortuneLife/agent/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/agent").hasAnyRole("ADMIN", "EMPLOYEE")
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/agent/{id}").hasAnyRole("ADMIN", "EMPLOYEE","AGENT")

                        // Insurance scheme endpoints
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/scheme/{planId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/scheme/{planId}/{id}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/fortuneLife/scheme/{planId}").hasAnyRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/scheme/{planId}").hasAnyRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/fortuneLife/scheme/{planId}/{id}").hasAnyRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/scheme/activate/{planId}/{id}").hasAnyRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/scheme/update-commission/{planId}/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/scheme").hasAnyRole("ADMIN","EMPLOYEE")
                        
                        // Customer Endpoints
                        .requestMatchers(HttpMethod.POST, "/fortuneLife/customer").hasAnyRole("ADMIN", "EMPLOYEE","AGENT")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/customer").hasAnyRole("ADMIN", "EMPLOYEE", "CUSTOMER","AGENT")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/customer/activate/{id}").hasAnyRole("ADMIN", "EMPLOYEE")
                        .requestMatchers(HttpMethod.DELETE, "/fortuneLife/customer/{id}").hasAnyRole("ADMIN", "EMPLOYEE")
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/customer").hasAnyRole("ADMIN", "EMPLOYEE", "CUSTOMER")
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/customer/{id}")
                        .hasAnyRole("ADMIN", "EMPLOYEE", "CUSTOMER")
                        .requestMatchers(HttpMethod.POST,
                                "/fortuneLife/customer/{customerId}/Insurance-Scheme/{schemeId}/agent/{agentId}/policy")
                        .hasAnyRole("ADMIN", "EMPLOYEE", "AGENT")
                        .requestMatchers(HttpMethod.POST,
                                "/fortuneLife/claim/customer/{customerId}/Insurance-policy/{policyId}")
                        .hasAnyRole("CUSTOMER", "AGENT")

                        .requestMatchers(HttpMethod.GET, "/fortuneLife/policy")
                        .hasAnyRole("ADMIN", "CUSTOMER", "AGENT", "EMPLOYEE")

                        // Payment endpoint
                        .requestMatchers(HttpMethod.POST, "/fortuneLife/payments/charge").permitAll()
                        .requestMatchers(HttpMethod.POST, "/fortuneLife/stripe/webhook").permitAll()

                        // File endpoints
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/file/view/{name}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/fortuneLife/file/upload").permitAll()

                        // City endpoints /{pincode}/scheme/{schemeId}
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/city/{stateId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/city/{stateId}/{id}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/fortuneLife/city/{stateId}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/city/{stateId}").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.DELETE, "/fortuneLife/city/{stateId}/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/city/activate/{stateId}/{id}").hasRole("ADMIN")

                        // State endpoints /{stateId}/scheme/{schemeId}
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/state").permitAll()
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/state/{id}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/fortuneLife/state").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/state").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/fortuneLife/state/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/state/activate/{id}").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.DELETE, "/fortuneLife/state//{stateId}/scheme/{schemeId}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/state/{stateId}/scheme/{schemeId}").hasRole("ADMIN")


                      

                        // Insurance Plan endpoints
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/plan").permitAll()
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/plan/{id}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/fortuneLife/plan").hasAnyRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/plan").hasAnyRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/fortuneLife/plan/{id}").hasAnyRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/plan/activate/{id}").hasAnyRole("ADMIN")

                        // City endpoints
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/city/{stateId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/city/{stateId}/{id}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/fortuneLife/city/{stateId}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/city/{stateId}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/fortuneLife/city/{stateId}/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/city/activate/{stateId}/{id}").hasRole("ADMIN")

                        // State endpoints
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/state").permitAll()
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/state/{id}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/fortuneLife/state").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/state").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/fortuneLife/state/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/state/activate/{id}").hasRole("ADMIN")

                        // Query endpoints
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/query").hasAnyRole("ADMIN","EMPLOYEE","CUSTOMER")
                        .requestMatchers(HttpMethod.POST, "/fortuneLife/query").hasAnyRole("CUSTOMER")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/query/edit").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/query/answer").hasAnyRole("ADMIN","EMPLOYEE")
                        .requestMatchers(HttpMethod.DELETE, "/fortuneLife/query/{id}").hasAnyRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/fortuneLife/query/activate/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/fortuneLife/query/{customerEmail}")
                        .hasAnyRole("CUSTOMER", "AGENT", "ADMIN", "EMPLOYEE")

                       

                        // Any other request must be authenticated
                        .anyRequest().authenticated())
                .exceptionHandling(exception -> exception.authenticationEntryPoint(authenticationEntryPoint))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
