package com.techlabs.app.controller;

import com.techlabs.app.dto.RequestSchemeDto;
import com.techlabs.app.dto.SchemeDto;
import com.techlabs.app.service.InsuranceSchemeService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Path;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fortuneLife/scheme")
public class InsuranceSchemeController {
    private static final Logger logger = LoggerFactory.getLogger(InsuranceSchemeController.class);

    @Autowired
    private InsuranceSchemeService schemeService;

    @Operation(summary = "Fetch all schemes by Insurance Plan ID")
    @GetMapping("/{planId}")
    public ResponseEntity<List<SchemeDto>> getAllSchemesByPlanId(@PathVariable(name = "planId") Long planId) {
        logger.info("Fetching all schemes");
        List<SchemeDto> schemeDtoList = schemeService.getAllSchemesByPlanId(planId);

        return new ResponseEntity<>(schemeDtoList, HttpStatus.OK);
    }
    
    @PreAuthorize("permitAll()")
    @Operation(summary = "Fetch all schemes")
    @GetMapping()
    public ResponseEntity<List<SchemeDto>> getAllSchemes() {
        logger.info("Fetching all schemes");
        List<SchemeDto> schemeDtoList = schemeService.getAllSchemes();

        return new ResponseEntity<>(schemeDtoList, HttpStatus.OK);
    }


    @Operation(summary = "Fetch scheme by particular ID")
    @GetMapping("/{planId}/{id}")
    public ResponseEntity<SchemeDto> getSchemeByPlanId(@PathVariable(name = "planId") Long planId,
                                                       @PathVariable(name = "id") Long id) {
        logger.info("Fetching scheme by ID");
        SchemeDto schemeDto = schemeService.getSchemeByPlanId(planId, id);

        return new ResponseEntity<>(schemeDto, HttpStatus.OK);
    }

    @Operation(summary = "Add new Scheme")
    @PostMapping("/{planId}")
    public ResponseEntity<SchemeDto> createNewScheme(@PathVariable(name = "planId") Long planId,
                                                     @Valid @RequestBody RequestSchemeDto schemeDto) {
        logger.info("Creating new scheme");
        SchemeDto newScheme = schemeService.createScheme(schemeDto, planId);

        return new ResponseEntity<>(newScheme, HttpStatus.OK);
    }

    @Operation(summary = "Update existing scheme")
    @PutMapping("/{planId}")
    public ResponseEntity<SchemeDto> updateScheme(@PathVariable(name = "planId") Long planId,
                                                  @Valid @RequestBody RequestSchemeDto schemeDto) {
        logger.info("Updating existing scheme");
        SchemeDto updatedScheme = schemeService.updateScheme(schemeDto, planId);

        return new ResponseEntity<>(updatedScheme, HttpStatus.OK);
    }

    @Operation(summary = "Delete existing scheme")
    @DeleteMapping("/{planId}/{id}")
    public ResponseEntity<Object> deleteScheme(@PathVariable(name = "planId") Long planId,
                                               @PathVariable(name = "id") Long id) {
        logger.info("Deleting existing scheme");
        String message = schemeService.deleteScheme(planId, id);

        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    @Operation(summary = "Activate existing scheme")
    @PutMapping("/activate/{planId}/{id}")
    public ResponseEntity<Object> activateScheme(@PathVariable(name = "planId") Long planId,
                                                 @PathVariable(name = "id") Long id) {
        logger.info("Activating existing scheme");
        String message = schemeService.activateScheme(planId, id);

        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    @Operation(summary = "Update commission")
    @PutMapping("/update-commission/{planId}/{id}")
    public ResponseEntity<SchemeDto> updateCommission(@PathVariable(name = "planId") Long planId,
                                                      @PathVariable(name = "id") Long id,
                                                      @RequestParam(name = "installmentRatio") Double installmentRatio,
                                                      @RequestParam(name = "registrationAmount") Double registrationAmount,
                                                      @RequestParam(name = "profitRatio") Double profitRatio) {
        SchemeDto schemeDto = schemeService.updateCommission(planId, id, installmentRatio, registrationAmount, profitRatio);

        return new ResponseEntity<>(schemeDto, HttpStatus.OK);
    }

    @Operation(summary = "Change Scheme Image")
    @PutMapping("/update-scheme-image/{planId}/{id}")
    public ResponseEntity<SchemeDto> updateSchemeImage(@RequestParam(name = "schemeImage") String schemeImage,
                                                       @PathVariable(name = "planId") Long planId,
                                                       @PathVariable(name = "id") Long id) {
        SchemeDto schemeDto = schemeService.updateSchemeImage(planId, id, schemeImage);

        return new ResponseEntity<>(schemeDto, HttpStatus.OK);
    }


}