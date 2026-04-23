package com.dimash.jobtracker.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String header = request.getHeader("Authorization");
        System.out.println("JWT FILTER STARTED");
        System.out.println("HEADER: " + header);

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        System.out.println("TOKEN: " + token);

        String email;
        try {

            email = jwtService.extractEmail(token);

            System.out.println("EMAIL FROM JWT: " + email);

        } catch (Exception e) {

            System.out.println("JWT ERROR: " + e.getMessage());

            e.printStackTrace();

            filterChain.doFilter(request, response);

            return;

        }

        if (email != null) {
            var userDetails = customUserDetailsService.loadUserByUsername(email);

            if (jwtService.isValid(token, userDetails.getUsername())) {
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContext context = SecurityContextHolder.createEmptyContext();
                context.setAuthentication(auth);
                SecurityContextHolder.setContext(context);

                System.out.println("AUTH SET: " + SecurityContextHolder.getContext().getAuthentication().getName());
            }
        }

        filterChain.doFilter(request, response);
    }
}