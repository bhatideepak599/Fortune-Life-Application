package com.techlabs.app.repository;

import com.techlabs.app.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    Set<City> findAllByStateId(Long stateId);

    Optional<City> findByStateIdAndId(Long stateId, Long id);
}
