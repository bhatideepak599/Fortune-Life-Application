package com.techlabs.app.repository;

import com.techlabs.app.entity.SchemeDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SchemeDetailsRepository extends JpaRepository<SchemeDetails, Long> {
}
