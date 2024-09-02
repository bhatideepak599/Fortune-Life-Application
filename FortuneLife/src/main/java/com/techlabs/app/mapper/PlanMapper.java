package com.techlabs.app.mapper;

import com.techlabs.app.dto.PlanDto;
import com.techlabs.app.entity.InsurancePlan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class PlanMapper {

    @Autowired
    private SchemeMapper schemeMapper;

    public InsurancePlan dtoToEntity(PlanDto planDto) {
        InsurancePlan insurancePlan = new InsurancePlan();
        insurancePlan.setPlanName(planDto.getPlanName());
        insurancePlan.setActive(planDto.getActive());

        return insurancePlan;
    }

    public PlanDto entityToDto(InsurancePlan insurancePlan) {
        PlanDto planDto = new PlanDto();
        planDto.setId(insurancePlan.getId());
        planDto.setPlanName(insurancePlan.getPlanName());
        planDto.setActive(insurancePlan.getActive());
        System.out.println(planDto);

        return planDto;
    }

    public List<PlanDto> getDtoList(List<InsurancePlan> insurancePlans) {
        List<PlanDto> planDtoList = new ArrayList<>();
        for (InsurancePlan insurancePlan : insurancePlans) {
            planDtoList.add(entityToDto(insurancePlan));
        }

        return planDtoList;
    }

    public List<InsurancePlan> getEntityList(List<PlanDto> planDtoList) {
        List<InsurancePlan> insurancePlanList = new ArrayList<>();
        for (PlanDto planDto : planDtoList) {
            insurancePlanList.add(dtoToEntity(planDto));
        }

        return insurancePlanList;
    }
}
