package com.techlabs.app.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.techlabs.app.dto.PaymentDto;
import com.techlabs.app.entity.Payment;

public interface StripePaymentService {
    PaymentIntent createPaymentIntent(PaymentDto paymentDto, Payment payment) throws StripeException;
}
