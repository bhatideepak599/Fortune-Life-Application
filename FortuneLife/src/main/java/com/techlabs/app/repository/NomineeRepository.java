package com.techlabs.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.techlabs.app.entity.Nominee;

@Repository
public interface NomineeRepository extends JpaRepository<Nominee, Long> {

}
