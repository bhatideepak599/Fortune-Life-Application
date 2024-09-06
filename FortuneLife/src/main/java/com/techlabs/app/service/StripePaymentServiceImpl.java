package com.techlabs.app.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.techlabs.app.dto.PaymentDto;
import com.techlabs.app.entity.*;
import com.techlabs.app.enums.CommissionType;
import com.techlabs.app.enums.PaymentType;
import com.techlabs.app.exception.FortuneLifeException;
import com.techlabs.app.repository.AgentRepository;
import com.techlabs.app.repository.CommissionRepository;
import com.techlabs.app.repository.InsurancePolicyRepository;
import com.techlabs.app.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StripePaymentServiceImpl implements StripePaymentService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Autowired
    private InsurancePolicyRepository policyRepository;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private CommissionRepository commissionRepository;
    @Autowired
    private AgentRepository agentRepository;

    @Override
    public PaymentIntent createPaymentIntent(PaymentDto paymentDto, Payment payment) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        Map<String, Object> params = new HashMap<>();
        params.put("amount", (int) (paymentDto.getTotalPayment() * 100)); // Stripe expects amount in cents
        params.put("currency", "inr");
        params.put("payment_method", paymentDto.getPaymentMethodId());

        InsurancePolicy policy = policyRepository.findById(paymentDto.getPolicyId())
                .orElseThrow(() -> new FortuneLifeException(
                        "Policy with ID : " + paymentDto.getPolicyId() + " cannot be found"));

        if (paymentDto.getPaymentType().equalsIgnoreCase("debit")) {
            payment.setPaymentType(PaymentType.DEBIT_CARD.name());
        } else {
            payment.setPaymentType(PaymentType.CREDIT_CARD.name());
        }

        payment.setAmount(paymentDto.getAmount());
        payment.setTax(paymentDto.getTax());
        payment.setTotalPayment(paymentDto.getTotalPayment());
        payment.setPaymentDate(LocalDateTime.now());
        policy.getPayments().add(payment);

        InsuranceScheme insuranceScheme = policyRepository.findInsuranceSchemeByPolicyId(policy.getId());
        double installmentRatio = insuranceScheme.getSchemeDetails().getInstallmentCommissionRatio();
        double commissionAmount = (paymentDto.getAmount() * installmentRatio) / 100;

        Agent agent = policy.getAgent();
        if (agent != null && agent.getActive() && agent.getVerified()) {
            List<Commission> commissions = agent.getCommissions();
            Commission commission = new Commission();
            commission.setCommissionType(CommissionType.INSTALMENT.name());
            commission.setAmount(commissionAmount);
            commission.setAgent(agent);
            Commission savedCommission = commissionRepository.save(commission);
            commissions.add(savedCommission);

            double totalCommission = agent.getTotalCommission() + commissionAmount;
            agent.setTotalCommission(totalCommission);

            agentRepository.save(agent);
        }


        return PaymentIntent.create(params);
    }
}
