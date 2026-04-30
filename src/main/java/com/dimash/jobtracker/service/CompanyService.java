package com.dimash.jobtracker.service;

import com.dimash.jobtracker.dto.auth.CompanyRequest;
import com.dimash.jobtracker.dto.auth.CompanyResponse;
import com.dimash.jobtracker.entity.Company;
import com.dimash.jobtracker.entity.User;
import com.dimash.jobtracker.enumtype.CompanyStatus;
import com.dimash.jobtracker.repository.CompanyRepository;
import com.dimash.jobtracker.repository.UserRepository;
import com.dimash.jobtracker.util.SecurityUtil;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public CompanyResponse create(String name, String position, CompanyStatus status){
        String email = SecurityUtil.getCurrentUserEmail();

        User user = userRepository.findByEmail(email).orElseThrow();

        Company company = Company.builder()
                .name(name)
                .position(position)
                .status(status)
                .user(user)
                .build();

        companyRepository.save(company);

        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getPosition(),
                company.getStatus()
        );

    }

    public List<CompanyResponse> getMyCompanies(){
        String email = SecurityUtil.getCurrentUserEmail();

        return companyRepository.findAllByUserEmail(email)
                .stream()
                .map(c -> new CompanyResponse(
                        c.getId(),
                        c.getName(),
                        c.getPosition(),
                        c.getStatus()
                )).toList();
    }

    public CompanyResponse update(Long id, CompanyRequest request){
        String email = SecurityUtil.getCurrentUserEmail();

        Company company = companyRepository.findById(id).orElseThrow();

        if(!company.getUser().getEmail().equals(email)){
            throw new RuntimeException("Access denied!");
        }

        company.setName(request.name());
        company.setPosition(request.position());
        company.setStatus(request.status());

        companyRepository.save(company);

        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getPosition(),
                company.getStatus()
        );
    }

    public void delete(Long id){
        String email = SecurityUtil.getCurrentUserEmail();

        Company company = companyRepository.findById(id).orElseThrow();

        if(!company.getUser().getEmail().equals(email))
            throw new RuntimeException("Access Denied!");

        companyRepository.delete(company);


    }

    public CompanyResponse get(Long id){
        String email = SecurityUtil.getCurrentUserEmail();

        Company company = companyRepository.findById(id).orElseThrow();

        if(!company.getUser().getEmail().equals(email))
            throw new RuntimeException("Access Denied!");

        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getPosition(),
                company.getStatus()
        );
    }

    public Page<CompanyResponse> getMyCompanies(

            CompanyStatus status,

            String search,

            int page,

            int size

    ) {

        String email = SecurityUtil.getCurrentUserEmail();

        Pageable pageable = PageRequest.of(page, size);

        Page<Company> companies;

        if (status != null) {

            companies = companyRepository

                    .findAllByUserEmailAndStatus(email, status, pageable);

        } else if (search != null && !search.isEmpty()) {

            companies = companyRepository

                    .findAllByUserEmailAndNameContainingIgnoreCase(email, search, pageable);

        } else {

            companies = companyRepository

                    .findAllByUserEmail(email, pageable);

        }

        return companies.map(c -> new CompanyResponse(

                c.getId(),

                c.getName(),

                c.getPosition(),

                c.getStatus()

        ));

    }


}
