package com.techlabs.app.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Pattern(regexp = "^(?=.*[A-Za-z0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]+$",
            message = "Username must contain alphanumeric characters and at least one special character.")
    @Column(nullable = false, unique = true)
    private String username;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Boolean active = true;

    @NotBlank
    @Pattern(regexp = "^[A-Za-z]+$", message = "First name must contain only alphabetic characters.")
    @Column(nullable = false)
    private String firstName;

    @NotBlank
    @Pattern(regexp = "^[A-Za-z]+$", message = "Last name must contain only alphabetic characters.")
    @Column(nullable = false)
    private String lastName;

    @NotBlank
    @Pattern(regexp = "MALE|FEMALE|OTHERS", message = "Gender must be 'MALE', 'FEMALE', or 'OTHERS'.")
    @Column(nullable = false)
    private String gender;

    @NotBlank
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be a valid 10-digit number.")
    @Column(nullable = false, unique = true)
    private String mobileNumber;

    @NotBlank
    @Email(message = "Email should be in a proper format.")
    @Column(nullable = false, unique = true)
    private String email;

    @Past(message = "Date of birth cannot be in the future.")
    private LocalDate dateOfBirth;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "addressId")
    private Address address;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "users_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Token token;
}