package com.dimash.jobtracker.util;

import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {
    public static String getCurrentUserEmail(){
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
    }
}
