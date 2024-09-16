package com.techlabs.app.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface PolicyReport {
    LocalDate getDate();
    Long getPoliciesBought();
    BigDecimal getTotalRevenue();
}
