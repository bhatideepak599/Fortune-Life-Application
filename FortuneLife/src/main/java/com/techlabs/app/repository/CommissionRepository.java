package com.techlabs.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.techlabs.app.entity.Commission;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, Long> {

}
