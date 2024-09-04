package com.techlabs.app.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.techlabs.app.dto.PaymentDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StripePaymentServiceImpl implements StripePaymentService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Override
    public PaymentIntent createPaymentIntent(PaymentDto paymentDto) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        Map<String, Object> params = new HashMap<>();

        params.put("amount", (int) (paymentDto.getTotalPayment() * (100))); // Stripe expects amount in cents
        params.put("currency", "inr");
        params.put("payment_method", paymentDto.getPaymentMethodId()); // Use the payment method ID from Stripe Elements

        return PaymentIntent.create(params);
    }
}
