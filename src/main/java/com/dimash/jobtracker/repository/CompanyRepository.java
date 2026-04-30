package com.dimash.jobtracker.repository;

import com.dimash.jobtracker.entity.Company;
import com.dimash.jobtracker.enumtype.CompanyStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;

import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    List<Company> findAllByUserEmail(String email);

    Page<Company> findAllByUserEmailAndStatus(

            String email,

            CompanyStatus status,

            Pageable pageable

    );
    Page<Company> findAllByUserEmailAndNameContainingIgnoreCase(

            String email,

            String name,

            Pageable pageable

    );

    Page<Company> findAllByUserEmail(

            String email,

            Pageable pageable

    );
}
