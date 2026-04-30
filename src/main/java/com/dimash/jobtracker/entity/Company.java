package com.dimash.jobtracker.entity;

import com.dimash.jobtracker.enumtype.CompanyStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name= "companies")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String position;

    @Enumerated(EnumType.STRING)
    private CompanyStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
