package com.techlabs.app.service;

import com.techlabs.app.entity.GlobalTax;
import com.techlabs.app.exception.FortuneLifeException;
import com.techlabs.app.repository.GlobalTaxRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TaxServiceImpl implements TaxService {
    @Autowired
    private GlobalTaxRepository globalTaxRepository;

    @Override
    public GlobalTax setTax(Double taxRate, Double deductionRate) {
        Optional<GlobalTax> existingTax = globalTaxRepository.findById(1L);

        if (existingTax.isPresent()) {
            GlobalTax existing = existingTax.get();
            existing.setTaxRate(taxRate);
            existing.setDeductionRate(deductionRate);
            return globalTaxRepository.save(existing);
        } else {
            GlobalTax newTax = new GlobalTax();
            newTax.setId(1L);
            newTax.setTaxRate(taxRate);
            newTax.setDeductionRate(deductionRate);
            return globalTaxRepository.save(newTax);
        }
    }

    @Override
    public GlobalTax getTax() {
        GlobalTax globalTax = globalTaxRepository.findById(1L)
                .orElseThrow(() -> new FortuneLifeException("Tax didn't exist please set tax"));

        return globalTax;
    }

}
