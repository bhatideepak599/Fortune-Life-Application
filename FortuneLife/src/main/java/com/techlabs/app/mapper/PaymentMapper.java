package com.techlabs.app.mapper;

import com.techlabs.app.dto.PaymentDto;
import com.techlabs.app.entity.Payment;
import com.techlabs.app.entity.InsurancePolicy;
import com.techlabs.app.repository.InsurancePolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PaymentMapper {

    @Autowired
    private InsurancePolicyRepository insurancePolicyRepository;

    // Convert Payment entity to PaymentDto
    public PaymentDto entityToDto(Payment payment) {
        if (payment == null) {
            return null;
        }

        // Fetch the related InsurancePolicy to get the policy holder's name and other details
        InsurancePolicy policy = insurancePolicyRepository.findById(payment.getInsurancePolicy().getId())
                .orElseThrow(() -> new RuntimeException("Policy not found"));

        PaymentDto paymentDto = new PaymentDto();
        paymentDto.setPolicyHolderName(policy.getCustomer().getUser().getFirstName() + " " + policy.getCustomer().getUser().getLastName()); // Assuming agent has user


        paymentDto.setPolicyId(policy.getId());
        paymentDto.setPaymentId(payment.getId());
        paymentDto.setDateOfPayment(payment.getPaymentDate());
        paymentDto.setPaymentType(payment.getPaymentType());
        paymentDto.setAmount(payment.getAmount());
        paymentDto.setTax(payment.getTax());
        paymentDto.setTotalPayment(payment.getTotalPayment());
        paymentDto.setPaymentStatus(payment.getPaymentStatus());

        return paymentDto;
    }

    // Convert PaymentDto to Payment entity
    public Payment dtoToEntity(PaymentDto paymentDto) {
        if (paymentDto == null) {
            return null;
        }

        Payment payment = new Payment();
        payment.setPaymentType(paymentDto.getPaymentType());
        payment.setAmount(paymentDto.getAmount());
        payment.setPaymentDate(paymentDto.getDateOfPayment());
        payment.setTax(paymentDto.getTax());
        payment.setTotalPayment(paymentDto.getTotalPayment());
        payment.setPaymentStatus(paymentDto.getPaymentStatus());

        // Fetch the related InsurancePolicy and set it in the Payment entity
        InsurancePolicy policy = insurancePolicyRepository.findById(paymentDto.getPolicyId())
                .orElseThrow(() -> new RuntimeException("Policy not found"));

        payment.setInsurancePolicy(policy);

        return payment;
    }

    // Convert a list of Payment entities to a list of PaymentDtos
    public List<PaymentDto> getDtoList(List<Payment> payments) {
        return payments.stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
    }

    // Convert a list of PaymentDtos to a list of Payment entities
    public List<Payment> getEntityList(List<PaymentDto> paymentDtos) {
        return paymentDtos.stream()
                .map(this::dtoToEntity)
                .collect(Collectors.toList());
    }
}
