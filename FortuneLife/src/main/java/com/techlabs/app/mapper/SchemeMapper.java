package com.techlabs.app.mapper;

import com.techlabs.app.dto.InsurancePolicyResponseDto;
import com.techlabs.app.dto.SchemeDto;
import com.techlabs.app.entity.InsurancePolicy;
import com.techlabs.app.entity.InsuranceScheme;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class SchemeMapper {

    @Autowired
    private SchemeDetailsMapper schemeDetailsMapper;
    @Autowired
    private InsurancePolicyMapper insurancePolicyMapper;

    public InsuranceScheme dtoToEntity(SchemeDto schemeDto) {
        InsuranceScheme insuranceScheme = new InsuranceScheme();
        insuranceScheme.setActive(schemeDto.getActive());
        insuranceScheme.setSchemeName(schemeDto.getSchemeName());
        insuranceScheme.setSchemeDetails(schemeDetailsMapper.dtoToEntity(schemeDto.getSchemeDetails()));

        return insuranceScheme;
    }

    public SchemeDto entityToDto(InsuranceScheme insuranceScheme) {
        SchemeDto schemeDto = new SchemeDto();
        schemeDto.setId(insuranceScheme.getId());
        schemeDto.setActive(insuranceScheme.getActive());
        schemeDto.setSchemeName(insuranceScheme.getSchemeName());
        schemeDto.setSchemeDetails(schemeDetailsMapper.entityToDto(insuranceScheme.getSchemeDetails()));
        
        
        List<InsurancePolicyResponseDto> policiesDto=new ArrayList<>();
        for(InsurancePolicy policy:insuranceScheme.getPolicies()) {
        	InsurancePolicyResponseDto policyDto = insurancePolicyMapper.entityToDto(policy);
        	policiesDto.add(policyDto);
        }
        schemeDto.setPolicies(policiesDto);

        return schemeDto;
    }

    public List<InsuranceScheme> getEntityList(List<SchemeDto> schemes) {
        List<InsuranceScheme> insuranceSchemes = new ArrayList<>();
        for (SchemeDto schemeDto : schemes) {
            insuranceSchemes.add(dtoToEntity(schemeDto));
        }

        return insuranceSchemes;
    }

    public List<SchemeDto> getDtoList(List<InsuranceScheme> schemes) {
        List<SchemeDto> schemeDtoList = new ArrayList<>();
        for (InsuranceScheme insuranceScheme : schemes) {
            schemeDtoList.add(entityToDto(insuranceScheme));
        }

        return schemeDtoList;
    }
}
