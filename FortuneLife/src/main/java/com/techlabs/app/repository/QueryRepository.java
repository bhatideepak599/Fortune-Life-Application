package com.techlabs.app.repository;


import com.techlabs.app.entity.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QueryRepository extends JpaRepository<Query, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT q FROM Query q " +
            "WHERE (:id IS NULL OR q.id = :id) " +
            "AND (:title IS NULL OR q.title LIKE %:title%) " +
            "AND (:question IS NULL OR q.question LIKE %:question%) " +
            "AND (:answer IS NULL OR q.answer LIKE %:answer%) " +
            "AND (:active IS NULL OR q.active = :active) " +
            "AND (:queryResponse IS NULL OR q.queryResponse LIKE %:queryResponse%)")
    Page<Query> findByCriteria(@Param("id") Long id,
                               @Param("title") String title,
                               @Param("question") String question,
                               @Param("answer") String answer,
                               @Param("active") Boolean active,
                               @Param("queryResponse") String queryResponse,
                               Pageable pageable);

    List<Query> findAllByEmail(String customerEmail);

    @org.springframework.data.jpa.repository.Query("SELECT q FROM Query q " +
            "WHERE q.email = :customerEmail " +
            "AND (:id IS NULL OR q.id = :id) " +
            "AND (:title IS NULL OR q.title LIKE %:title%) " +
            "AND (:question IS NULL OR q.question LIKE %:question%) " +
            "AND (:answer IS NULL OR q.answer LIKE %:answer%) " +
            "AND (:active IS NULL OR q.active = :active) " +
            "AND (:queryResponse IS NULL OR q.queryResponse LIKE %:queryResponse%)")
    Page<Query> findByCustomerEmailAndCriteria(
            @Param("customerEmail") String customerEmail,
            @Param("id") Long id,
            @Param("title") String title,
            @Param("question") String question,
            @Param("answer") String answer,
            @Param("active") Boolean active,
            @Param("queryResponse") String queryResponse,
            Pageable pageable
    );
}
