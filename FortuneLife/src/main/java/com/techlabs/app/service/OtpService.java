package com.techlabs.app.service;

import com.techlabs.app.entity.Otp;
import com.techlabs.app.exception.FortuneLifeException;
import com.techlabs.app.repository.OtpRepository;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Random;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {
    @Autowired
	private MailService mailService;
    @Autowired
    private OtpRepository otpRepository;

	@Value("${twilio.phone.number}")
    private String twilioPhoneNumber;
    private final int OTP_LENGTH = 6;
    private final long OTP_VALID_DURATION = TimeUnit.MINUTES.toMillis(5); // 5 minutes



    public void sendOtp(String sourceType, String sourceValue) throws MessagingException {

        if(sourceType.equalsIgnoreCase("phoneNumber")){
            if(!sourceValue.startsWith("+")){
                throw new FortuneLifeException("Phone Number Should Begins with Country Code!.");
            }
        }
        String otpGenerated = generateOtp();

        LocalDateTime expirationTime = LocalDateTime.now().plus(10, ChronoUnit.MINUTES);

        Otp otp = new Otp();
        otp.setSource(sourceValue);
        otp.setOtpCode(otpGenerated);
        otp.setExpirationTime(expirationTime);
        otp.setCreatedTime(LocalDateTime.now());

        String messageBody = "Dear customer, your OTP for resetting your Login Password is: "
                + otpGenerated + ". Please use this code to proceed. This OTP is valid for 10 minutes.";

        // Send OTP based on source type
        if (sourceType.equalsIgnoreCase("email")) {
            String subject = "Your OTP for Password Reset Request";
            mailService.mailWithAttachment(sourceValue, subject, messageBody);
        } else if (sourceType.equalsIgnoreCase("phoneNumber")) {
            otp.setSource(sourceValue.substring(4));
            Message message = Message.creator(
                    new PhoneNumber(sourceValue),
                    new PhoneNumber(twilioPhoneNumber),
                    messageBody
            ).create();
        } else {
            throw new IllegalArgumentException("Invalid source type. Must be 'email' or 'Phone Number'.");
        }
        otpRepository.save(otp);
    }

    public String generateOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }

        String otpValue = otp.toString();
        return otpValue;
    }


}
