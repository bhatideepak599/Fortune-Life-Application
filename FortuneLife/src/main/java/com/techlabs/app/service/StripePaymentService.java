package com.techlabs.app.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.techlabs.app.dto.PaymentDto;
import com.techlabs.app.entity.Payment;

import java.time.LocalDateTime;
import java.util.List;

public interface StripePaymentService {
    PaymentIntent createPaymentIntent(PaymentDto paymentDto, Payment payment) throws StripeException;

    List<PaymentDto> getPaymentsByPolicyId(Long policyId);

    public Double calculateTotalRevenue(LocalDateTime startDate, LocalDateTime endDate) ;
    public List<Payment> getPaymentsWithinDateRange(
            LocalDateTime startDate, LocalDateTime endDate) ;
}
