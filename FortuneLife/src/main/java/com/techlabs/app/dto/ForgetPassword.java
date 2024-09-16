package com.techlabs.app.dto;

import lombok.Data;

@Data
public class ForgetPassword {
    private String userName;
    private String sourceType;
    private String sourceValue;
    private String otpReceived;
    private String password;

}
