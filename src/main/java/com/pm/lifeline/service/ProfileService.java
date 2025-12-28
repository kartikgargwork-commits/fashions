package com.pm.lifeline.service;

import com.pm.lifeline.dto.profile.ProfileRequest;
import com.pm.lifeline.dto.profile.ProfileResponse;
import com.pm.lifeline.entity.Profile;
import com.pm.lifeline.entity.User;
import com.pm.lifeline.repository.ProfileRepository;
import com.pm.lifeline.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    /**
     * Get logged-in user's profile
     */
    public ProfileResponse getMyProfile() {

        User user = getLoggedInUser();

        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Profile p = new Profile();
                    p.setUser(user);
                    p.setCreatedAt(LocalDateTime.now());
                    return profileRepository.save(p);
                });

        return mapToResponse(user, profile);
    }

    /**
     * Update logged-in user's profile
     */
    public ProfileResponse updateProfile(ProfileRequest request) {

        User user = getLoggedInUser();
        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        profile.setFullName(request.getFullName());
        profile.setPhone(request.getPhone());
        profile.setAddress(request.getAddress());
        profile.setUpdatedAt(LocalDateTime.now());

        profileRepository.save(profile);

        return mapToResponse(user, profile);
    }

    /**
     * Helper: get logged-in user
     */
    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Helper: entity → DTO
     */
    private ProfileResponse mapToResponse(User user, Profile profile) {
        return new ProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                profile.getPhone(),
                profile.getAddress(),
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }
}
