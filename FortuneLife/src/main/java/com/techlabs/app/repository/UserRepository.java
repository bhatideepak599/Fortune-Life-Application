package com.techlabs.app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.techlabs.app.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	Boolean existsByUsername(String username);
	Optional<User> findUserByUsernameOrEmail(String username, String email);
	Optional<User> findUserByUsername(String username);
	Boolean existsUserByUsername(String username);
	Boolean existsUserByEmail(String email);

}
