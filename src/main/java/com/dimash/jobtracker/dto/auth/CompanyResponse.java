package com.dimash.jobtracker.dto.auth;

import com.dimash.jobtracker.enumtype.CompanyStatus;

public record CompanyResponse(
        Long id,
        String name,
        String position,
        CompanyStatus status
) {
}
