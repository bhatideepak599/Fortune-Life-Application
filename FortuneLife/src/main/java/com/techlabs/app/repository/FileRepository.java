package com.techlabs.app.repository;

import com.techlabs.app.entity.FileItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<FileItem, Long> {
    Optional<FileItem> findByName(String name);
}
