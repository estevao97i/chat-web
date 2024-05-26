package com.chat.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Configuration
//@EnableWebMvc
public class WebConfig {

    @Bean
    public CorsFilter corsFilter() {
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Collections.singletonList("http://localhost:4200/"));
        config.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "responseType", "Authorization"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "OPTIONS", "DELETE", "PATCH"));
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

//    private void liberacaoCors(HttpServletResponse response) {
//        if (response.getHeader("Access-Control-Allow-Origin") == null) {
//            response.addHeader("Access-Control-Allow-Origin", "*");
//        }
//
//        if (response.getHeader("Access-Control-Allow-Headers") == null) {
//            response.addHeader("Access-Control-Allow-Headers", "*");
//        }
//
//        if (response.getHeader("Access-Control-Request-Headers") == null) {
//            response.addHeader("Access-Control-Request-Headers", "*");
//        }
//
//        if (response.getHeader("Access-Control-Allow-Methods") == null) {
//            response.addHeader("Access-Control-Allow-Methods", "*");
//        }
//    }
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration config = new CorsConfiguration();
//        config.setAllowedOrigins(List.of("http://localhost:4200/", "https://origin2.com"));
//        config.setAllowCredentials(true);
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", config);
//        return source;
//    }

//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**");
//                .allowedOrigins("*")
//                .allowedOriginPatterns()
//                .allowedMethods("GET", "POST", "PUT", "DELETE")
//                .allowedHeaders("true")
//                .exposedHeaders("Authorization");
//        WebMvcConfigurer.super.addCorsMappings(registry);
//    }
}
