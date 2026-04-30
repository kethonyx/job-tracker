package com.dimash.jobtracker.dto.auth;

import com.dimash.jobtracker.enumtype.CompanyStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

public record CompanyRequest(
        String name,
        String position,
        CompanyStatus status
) {

}
