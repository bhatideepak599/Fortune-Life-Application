package com.techlabs.app.config;

import com.techlabs.app.security.JwtAuthenticationEntryPoint;
import com.techlabs.app.security.JwtAuthenticationFilter;
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

	private JwtAuthenticationEntryPoint authenticationEntryPoint;
	private JwtAuthenticationFilter authenticationFilter;

	public SecurityConfig(JwtAuthenticationEntryPoint authenticationEntryPoint,
			JwtAuthenticationFilter authenticationFilter) {
		this.authenticationEntryPoint = authenticationEntryPoint;
		this.authenticationFilter = authenticationFilter;
	}

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
		http.csrf(csrf -> csrf.disable())
				.cors(withDefaults())
				.authorizeHttpRequests(authorize -> authorize

				// Swagger UI and API docs
				.requestMatchers(HttpMethod.GET, "/swagger-ui/**", "/v3/api-docs/**", "/swagger-resources/**",
						"/swagger-ui.html", "/webjars/**")
				.permitAll()

				// Authentication endpoints
				.requestMatchers(HttpMethod.POST, "/fortuneLife/auth/login").permitAll()
				.requestMatchers(HttpMethod.POST, "/fortuneLife/auth/signin").permitAll()
				.requestMatchers(HttpMethod.POST, "/fortuneLife/auth/register").permitAll()
				.requestMatchers(HttpMethod.GET, "/fortuneLife/auth/user").permitAll()
				.requestMatchers(HttpMethod.POST, "/fortuneLife/auth/signup").permitAll()
				.requestMatchers(HttpMethod.POST, "/fortuneLife/auth/logout").permitAll()
				.requestMatchers(HttpMethod.POST, "/fortuneLife/auth/verify-otp").permitAll()
				.requestMatchers(HttpMethod.GET, "/fortuneLife/auth/send-otp").permitAll()

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
				.requestMatchers(HttpMethod.GET, "/fortuneLife/admin/{id}").hasRole("ADMIN")
				.requestMatchers(HttpMethod.GET, "/fortuneLife/claim").hasRole("ADMIN")
				.requestMatchers(HttpMethod.GET, "/fortuneLife/claim/approve/{id}").hasRole("ADMIN")

				// Employee Endpoints
				.requestMatchers(HttpMethod.POST, "/fortuneLife/employee").hasAnyRole("ADMIN", "EMPLOYEE")
				.requestMatchers(HttpMethod.PUT, "/fortuneLife/employee").hasRole("ADMIN")
				.requestMatchers(HttpMethod.PUT, "/fortuneLife/employee/activate/{id}").hasRole("ADMIN")
				.requestMatchers(HttpMethod.DELETE, "/fortuneLife/employee/{id}").hasRole("ADMIN")
				.requestMatchers(HttpMethod.GET, "/fortuneLife/employee").hasAnyRole("ADMIN", "EMPLOYEE")
				.requestMatchers(HttpMethod.GET, "/fortuneLife/employee/{id}").hasAnyRole("ADMIN", "EMPLOYEE")

				// Agent Endpoints
				.requestMatchers(HttpMethod.POST, "/fortuneLife/agent").hasAnyRole("ADMIN", "EMPLOYEE")
				.requestMatchers(HttpMethod.PUT, "/fortuneLife/agent").hasRole("ADMIN")
				.requestMatchers(HttpMethod.PUT, "/fortuneLife/agent/activate/{id}").hasRole("ADMIN")
				.requestMatchers(HttpMethod.DELETE, "/fortuneLife/agent/{id}").hasRole("ADMIN")
				.requestMatchers(HttpMethod.GET, "/fortuneLife/agent").hasAnyRole("ADMIN", "EMPLOYEE")
				.requestMatchers(HttpMethod.GET, "/fortuneLife/agent/{id}").hasAnyRole("ADMIN", "EMPLOYEE")

				// Customer Endpoints
				.requestMatchers(HttpMethod.POST, "/fortuneLife/customer").hasAnyRole("ADMIN", "EMPLOYEE")
				.requestMatchers(HttpMethod.PUT, "/fortuneLife/customer").hasAnyRole("ADMIN", "EMPLOYEE")
				.requestMatchers(HttpMethod.PUT, "/fortuneLife/customer/activate/{id}").hasAnyRole("ADMIN", "EMPLOYEE")
				.requestMatchers(HttpMethod.DELETE, "/fortuneLife/customer/{id}").hasAnyRole("ADMIN", "EMPLOYEE")
				.requestMatchers(HttpMethod.GET, "/fortuneLife/customer").hasAnyRole("ADMIN", "EMPLOYEE")
				.requestMatchers(HttpMethod.GET, "/fortuneLife/customer/{id}")
				.hasAnyRole("ADMIN", "EMPLOYEE", "CUSTOMER")
				.requestMatchers(HttpMethod.POST,
						"/fortuneLife/customer/{customerId}/Insurance-Scheme/{schemeId}/agent/{agentId}/policy")
				.hasAnyRole("ADMIN", "EMPLOYEE", "AGENT")

				// Payment endpoint
				.requestMatchers(HttpMethod.POST, "/fortuneLife/payments/charge").permitAll()
				.requestMatchers(HttpMethod.POST, "/fortuneLife/stripe/webhook").permitAll()

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
