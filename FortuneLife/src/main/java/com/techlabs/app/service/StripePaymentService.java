package com.techlabs.app.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.techlabs.app.dto.PaymentDto;

public interface StripePaymentService {
    PaymentIntent createPaymentIntent(PaymentDto paymentDto) throws StripeException;
}
