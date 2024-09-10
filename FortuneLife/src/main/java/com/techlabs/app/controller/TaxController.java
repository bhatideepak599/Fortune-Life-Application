package com.techlabs.app.controller;

import com.techlabs.app.entity.GlobalTax;
import com.techlabs.app.service.TaxService;
import io.swagger.v3.oas.annotations.Operation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fortuneLife/tax")
public class TaxController {

    private static final Logger logger = LoggerFactory.getLogger(TaxController.class);

    @Autowired
    private TaxService taxSevice;

    @Operation(summary = "Tax setting")
    @PostMapping("/set-tax")
    public ResponseEntity<GlobalTax> setTax(@RequestParam(name = "taxRate") Double taxRate,
                                            @RequestParam(name = "deductionRate") Double deductionRate) {
        logger.info("Setting Tax");
        GlobalTax globalTax = taxSevice.setTax(taxRate, deductionRate);

        return new ResponseEntity<>(globalTax, HttpStatus.OK);
    }

    @Operation(summary = "Get Tax")
    @GetMapping("/get-tax")
    public ResponseEntity<GlobalTax> getTax() {
        logger.info("Getting tax");
        GlobalTax globalTax = taxSevice.getTax();

        return new ResponseEntity<>(globalTax, HttpStatus.OK);
    }
}
