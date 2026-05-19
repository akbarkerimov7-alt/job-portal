package com.akbar.jobportal.controller;

import com.akbar.jobportal.dto.UserResponse;
import com.akbar.jobportal.service.UserService;
import java.security.Principal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public UserResponse getProfile(Principal principal) {
        return userService.getProfile(principal.getName());
    }
}
