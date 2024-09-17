package com.techlabs.app.controller;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.techlabs.app.dto.PaymentDto;
import com.techlabs.app.entity.Payment;
import com.techlabs.app.enums.PaymentStatus;
import com.techlabs.app.repository.PaymentRepository;
import com.techlabs.app.service.StripePaymentService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/fortuneLife/payments")
public class PaymentController {
    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private StripePaymentService paymentService;

    @Autowired
    private PaymentRepository paymentRepository;

    @PostMapping("/charge")
    public ResponseEntity<Object> chargeCard(@Valid @RequestBody PaymentDto paymentDto) {
      //  System.out.println("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
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

    @Operation(summary = "Get All Payments By Policy ID")
    @GetMapping("/policies/{policyId}")
    public ResponseEntity<List<PaymentDto>> getPaymentsByPolicyId(@PathVariable Long policyId) {
        logger.info("Fetching all payments for policy with ID: {}", policyId);
        List<PaymentDto> paymentDtos = paymentService.getPaymentsByPolicyId(policyId);
        return new ResponseEntity<>(paymentDtos, HttpStatus.OK);
    }

    @Secured("ADMIN")
    @GetMapping("/revenue")
    public Double getRevenue(@RequestParam("startDate") String startDateStr, @RequestParam("endDate") String endDateStr) {
        LocalDateTime startDate = LocalDateTime.parse(startDateStr);
        LocalDateTime endDate = LocalDateTime.parse(endDateStr);

        return paymentService.calculateTotalRevenue(startDate, endDate);
    }
}
