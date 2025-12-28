package com.pm.lifeline.controller;

import com.pm.lifeline.dto.profile.ProfileRequest;
import com.pm.lifeline.dto.profile.ProfileResponse;
import com.pm.lifeline.service.ProfileService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    /**
     * Get logged-in user's profile
     */
    @GetMapping
    public ProfileResponse getProfile() {
        return profileService.getMyProfile();
    }

    /**
     * Update logged-in user's profile
     */
    @PutMapping
    public ProfileResponse updateProfile(@RequestBody ProfileRequest request) {
        return profileService.updateProfile(request);
    }
}
