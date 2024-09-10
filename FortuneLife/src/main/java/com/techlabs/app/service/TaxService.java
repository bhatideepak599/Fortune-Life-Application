package com.techlabs.app.service;

import com.techlabs.app.entity.GlobalTax;

public interface TaxService {
    GlobalTax setTax(Double taxRate, Double deductionRate);

    GlobalTax getTax();
}
