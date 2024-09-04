package com.techlabs.app.controller;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.techlabs.app.dto.PaymentDto;
import com.techlabs.app.entity.Payment;
import com.techlabs.app.enums.PaymentStatus;
import com.techlabs.app.repository.PaymentRepository;
import com.techlabs.app.service.StripePaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/fortuneLife/payments")
public class PaymentController {

    @Autowired
    private StripePaymentService paymentService;

    @Autowired
    private PaymentRepository paymentRepository;

    @PostMapping("/charge")
    public ResponseEntity<Object> chargeCard(@Valid @RequestBody PaymentDto paymentDto) {
        Payment payment = new Payment();
        try {

            PaymentIntent paymentIntent = paymentService.createPaymentIntent(paymentDto,payment);

            Map<String, Object> response = new HashMap<>();
            response.put("clientSecret", paymentIntent.getClientSecret());
            response.put("id", paymentIntent.getId());
            response.put("status", paymentIntent.getStatus());

            payment.setPaymentStatus(PaymentStatus.PAID.name());
            paymentRepository.save(payment);

            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());

            payment.setPaymentStatus(PaymentStatus.UNPAID.name());
            paymentRepository.save(payment);

            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }
}
