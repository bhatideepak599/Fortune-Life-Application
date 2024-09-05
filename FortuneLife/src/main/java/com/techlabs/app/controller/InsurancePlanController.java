package com.techlabs.app.controller;

import com.techlabs.app.dto.PlanDto;
import com.techlabs.app.service.InsurancePlanService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fortuneLife/plan")
public class InsurancePlanController {

    private static final Logger logger = LoggerFactory.getLogger(InsurancePlanController.class);

    @Autowired
    private InsurancePlanService planService;

    @Operation(summary = "Get All insurance Plans")
    @GetMapping
    public ResponseEntity<List<PlanDto>> getAllInsurancePlans() {
        logger.info("Fetching All Insurance Plans");
        List<PlanDto> planDtoList = planService.getAllPlans();

        return new ResponseEntity<>(planDtoList, HttpStatus.OK);
    }

    @Operation(summary = "Get Insurance Plan by ID")
    @GetMapping("/{id}")
    public ResponseEntity<PlanDto> getInsurancePlanById(@PathVariable(name = "id") Long id) {
        logger.info("Fetching Insurance Plan by ID : {}", id);
        PlanDto planDto = planService.getPlanById(id);

        return new ResponseEntity<>(planDto, HttpStatus.OK);
    }

    @Operation(summary = "Create New Insurance Plan")
    @PostMapping
    public ResponseEntity<PlanDto> createNewInsurancePlan(@Valid @RequestBody PlanDto planDto) {
        logger.info("Creating new Insurance Plan");
        PlanDto newPlanDto = planService.createNewPlan(planDto);

        return new ResponseEntity<>(newPlanDto, HttpStatus.OK);
    }

    @Operation(summary = "Edit Insurance Plan")
    @PutMapping
    public ResponseEntity<PlanDto> updateInsurancePlan(@Valid @RequestBody PlanDto planDto) {
        logger.info("Updating Insurance Plan");
        PlanDto updatedPlanDto = planService.updateExistingPlan(planDto);

        return new ResponseEntity<>(updatedPlanDto, HttpStatus.OK);
    }

    @Operation(summary = "Delete Existing Plan by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteInsurancePlanById(@PathVariable(name = "id") Long id) {
        logger.info("Deleting Insurance Plan by ID : {}", id);
        String message = planService.deletePlan(id);

        return ResponseEntity.ok(message);
    }

    @Operation(summary = "Activate Existing Plan by ID")
    @PutMapping("/activate/{id}")
    public ResponseEntity<Object> activateInsurancePlanById(@PathVariable(name = "id") Long id) {
        logger.info("Activating Insurance Plan by ID : {}", id);
        String message = planService.activatePlan(id);

        return ResponseEntity.ok(message);
    }
}
