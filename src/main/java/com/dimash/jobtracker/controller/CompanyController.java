package com.dimash.jobtracker.controller;

import com.dimash.jobtracker.dto.auth.CompanyRequest;
import com.dimash.jobtracker.dto.auth.CompanyResponse;
import com.dimash.jobtracker.enumtype.CompanyStatus;
import com.dimash.jobtracker.repository.CompanyRepository;
import com.dimash.jobtracker.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    public CompanyResponse create(@RequestBody CompanyRequest request){
        return companyService.create(
                request.name(),
                request.position(),
                request.status()
        );
    }

    @GetMapping
    public List<CompanyResponse> getAll() {
        return companyService.getMyCompanies();
    }

    @PostMapping("/{id}")
    public CompanyResponse update(@PathVariable Long id,
                                  @RequestBody CompanyRequest request){
        return companyService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        companyService.delete(id);
    }

    @GetMapping("/{id}")
    public CompanyResponse get(@PathVariable Long id){
       return companyService.get(id);
    }

    @GetMapping("/my")

    public Page<CompanyResponse> getMyCompanies(

            @RequestParam(required = false) CompanyStatus status,

            @RequestParam(required = false) String search,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size

    ) {

        return companyService.getMyCompanies(status, search, page, size);

    }
}
