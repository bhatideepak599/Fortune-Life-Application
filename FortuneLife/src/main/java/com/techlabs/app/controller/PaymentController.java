package com.techlabs.app.controller;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.techlabs.app.dto.PaymentDto;
import com.techlabs.app.entity.Payment;
import com.techlabs.app.enums.PaymentStatus;
import com.techlabs.app.enums.PaymentType;
import com.techlabs.app.service.StripePaymentService;
import com.techlabs.app.repository.PaymentRepository;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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
        // Map PaymentDto to Payment entity
        Payment payment = new Payment();

        if (paymentDto.getPaymentType().equalsIgnoreCase("debit")) {
            payment.setPaymentType(PaymentType.DEBIT_CARD.name());
        } else {
            payment.setPaymentType(PaymentType.CREDIT_CARD.name());
        }

        payment.setAmount(paymentDto.getAmount());
        payment.setTax(paymentDto.getTax());
        payment.setTotalPayment(paymentDto.getTotalPayment());
        payment.setPaymentDate(LocalDateTime.now());

        try {
            // Process the payment using Stripe
            PaymentIntent paymentIntent = paymentService.createPaymentIntent(paymentDto);

            // If successful, set payment status to PAID and save to database
            payment.setPaymentStatus(PaymentStatus.PAID.name());
            paymentRepository.save(payment);

            // Prepare response with PaymentIntent details
            Map<String, Object> response = new HashMap<>();
            response.put("clientSecret", paymentIntent.getClientSecret());
            response.put("id", paymentIntent.getId());
            response.put("status", paymentIntent.getStatus());

            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            // If an error occurs, set payment status to UNPAID and save to database
            payment.setPaymentStatus(PaymentStatus.UNPAID.name());
            paymentRepository.save(payment);

            // Return error details
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());

            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

}
