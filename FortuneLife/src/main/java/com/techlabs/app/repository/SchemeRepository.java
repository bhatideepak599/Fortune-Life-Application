package com.techlabs.app.repository;

import com.techlabs.app.entity.InsuranceScheme;
import com.techlabs.app.entity.User;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SchemeRepository extends JpaRepository<InsuranceScheme, Long> {
    Optional<InsuranceScheme> findBySchemeName(String schemeName);
}
