package com.techlabs.app.repository;

import com.techlabs.app.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtpRepository extends JpaRepository<Otp,String>{
}
