package com.techlabs.app.repository;

import com.techlabs.app.entity.GlobalTax;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GlobalTaxRepository extends JpaRepository<GlobalTax, Long> {
}
