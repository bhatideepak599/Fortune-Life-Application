package com.techlabs.app.service;

import com.techlabs.app.dto.PlanDto;

import java.util.List;

public interface InsurancePlanService {
    List<PlanDto> getAllPlans();

    PlanDto getPlanById(Long id);

    PlanDto createNewPlan(PlanDto planDto);

    PlanDto updateExistingPlan(PlanDto planDto);

    String deletePlan(Long id);

    String activatePlan(Long id);
}
