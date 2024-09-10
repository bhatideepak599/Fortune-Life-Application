package com.techlabs.app.repository;

import com.techlabs.app.entity.City;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    Set<City> findAllByStateId(Long stateId);

    Optional<City> findByStateIdAndPincode(Long stateId, Long id);

	Optional<City> findByPincode(Long pincode);
}
