package com.pm.lifeline.dto.profile;

import lombok.Data;

@Data
public class ProfileRequest {
    private String fullName;
    private String phone;
    private String address;
}
