package com.techlabs.app.service;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {
	
	@Value("${twilio.phone.number}")
    private String twilioPhoneNumber;
    private final int OTP_LENGTH = 6;
    private final Map<String, String> otpStorage = new HashMap<>();
    private final Map<String, Long> otpExpiry = new HashMap<>();
    private final long OTP_VALID_DURATION = TimeUnit.MINUTES.toMillis(5); // 5 minutes
    
    public void sendOtp(String phoneNumber, String otp) {
        Message message = Message.creator(
                new PhoneNumber(phoneNumber),
                new PhoneNumber(twilioPhoneNumber),
                "Your OTP code is: " + otp
        ).create();
    }

    public String generateOtp(String phoneNumber) {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }

        String otpValue = otp.toString();
        otpStorage.put(phoneNumber, otpValue);
        otpExpiry.put(phoneNumber, System.currentTimeMillis() + OTP_VALID_DURATION);
        return otpValue;
    }

    public boolean validateOtp(String phoneNumber, String otpProvided) {
        String originalOtp = otpStorage.get(phoneNumber);
        Long expiryTime = otpExpiry.get(phoneNumber);

        if (originalOtp != null && expiryTime != null) {
            if (System.currentTimeMillis() > expiryTime) {
                otpStorage.remove(phoneNumber);
                otpExpiry.remove(phoneNumber);
                return false; // OTP expired
            }

            if (originalOtp.equals(otpProvided)) {
                otpStorage.remove(phoneNumber); // OTP is used, remove it
                otpExpiry.remove(phoneNumber);
                return true;
            }
        }
        return false;
    }
}
