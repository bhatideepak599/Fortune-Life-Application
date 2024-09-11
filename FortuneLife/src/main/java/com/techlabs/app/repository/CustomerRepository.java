package com.techlabs.app.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.techlabs.app.entity.Customer;
import com.techlabs.app.entity.User;
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
	
	@Query("SELECT a FROM Customer a " +
		       "JOIN a.user u " +
		       "WHERE (:id IS NULL OR a.id = :id) " +
		       "AND (:email IS NULL OR u.email = :email) " +
		       "AND (:name IS NULL OR CONCAT(u.firstName, ' ', u.lastName) LIKE %:name%) " +
		       "AND (:userName IS NULL OR u.username LIKE %:userName%) " +
		       "AND (:mobileNumber IS NULL OR u.mobileNumber LIKE %:mobileNumber%) " +
		       "AND (:active IS NULL OR a.active = :active)")
	Page<Customer> findByIdAndUserNameAndNameAndMobileNumberAndEmailAndActive(@Param("id") Long id,
            @Param("email") String email,
            @Param("name") String name,
            @Param("userName") String userName,
            @Param("mobileNumber") String mobileNumber,
            @Param("active") Boolean active,
            Pageable pageable);

	Optional<Customer> findByUser(User user);

}
