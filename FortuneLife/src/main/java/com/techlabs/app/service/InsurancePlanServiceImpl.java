package com.techlabs.app.service;

import com.techlabs.app.dto.PlanDto;
import com.techlabs.app.entity.InsurancePlan;
import com.techlabs.app.entity.InsuranceScheme;
import com.techlabs.app.exception.InsurancePlanException;
import com.techlabs.app.mapper.PlanMapper;
import com.techlabs.app.repository.InsurancePlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class InsurancePlanServiceImpl implements InsurancePlanService {
    @Autowired
    private InsurancePlanRepository planRepository;

    @Autowired
    private PlanMapper planMapper;


    @Override
    public List<PlanDto> getAllPlans() {
        List<InsurancePlan> insurancePlans = planRepository.findAll();
        if (insurancePlans.isEmpty()) {
            throw new InsurancePlanException("There are no insurance plans to be found");
        }

        return planMapper.getDtoList(insurancePlans);
    }

    @Override
    public PlanDto getPlanById(Long id) {
        InsurancePlan insurancePlan = planRepository.findById(id)
                .orElseThrow(() -> new InsurancePlanException("Insurance Plan with ID : " + id + " cannot be found"));

        return planMapper.entityToDto(insurancePlan);
    }

    @Override
    public PlanDto createNewPlan(PlanDto planDto) {
        Optional<InsurancePlan> plan = planRepository.findByPlanName(planDto.getPlanName());
        if(plan.isPresent()){
            throw new InsurancePlanException("Insurance Plan with same name already exists");
        }
        InsurancePlan insurancePlan = planMapper.dtoToEntity(planDto);
        List<InsuranceScheme> schemes = new ArrayList<>();
        insurancePlan.setSchemes(schemes);
        InsurancePlan savedPlan = planRepository.save(insurancePlan);
        System.out.println(savedPlan.getId());

        return planMapper.entityToDto(savedPlan);
    }

    @Override
    public PlanDto updateExistingPlan(PlanDto planDto) {
        InsurancePlan plan = planRepository.findById(planDto.getId())
                .orElseThrow(() -> new InsurancePlanException("Insurance Plan with ID : " + planDto.getId() + " cannot be found"));
        if (!plan.getActive()) {
            throw new InsurancePlanException("Insurance Plan with ID : " + plan.getId() + " is not active");
        }

        InsurancePlan insurancePlan = planMapper.dtoToEntity(planDto);
        insurancePlan.setId(planDto.getId());
        InsurancePlan updatedPlan = planRepository.save(insurancePlan);

        return planMapper.entityToDto(updatedPlan);
    }

    @Override
    public String deletePlan(Long id) {
        InsurancePlan insurancePlan = planRepository.findById(id)
                .orElseThrow(() -> new InsurancePlanException("Insurance Plan with ID : " + id + " cannot be found"));
        insurancePlan.setActive(false);
        planRepository.save(insurancePlan);

        return "Insurance plan with ID : " + id + " deleted successfully";
    }

    @Override
    public String activatePlan(Long id) {
        InsurancePlan insurancePlan = planRepository.findById(id)
                .orElseThrow(() -> new InsurancePlanException("Insurance Plan with ID : " + id + " cannot be found"));
        if (insurancePlan.getActive()) {
            throw new InsurancePlanException("Insurance Plan with ID : " + id + " is already active");
        }

        insurancePlan.setActive(true);
        planRepository.save(insurancePlan);
        return "Insurance Plan with ID : " + id + " is activated successfully";
    }
}
