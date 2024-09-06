package com.techlabs.app.mapper;

import com.techlabs.app.dto.SchemeDetailsDto;
import com.techlabs.app.entity.SchemeDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class SchemeDetailsMapper {

    @Autowired
    private SchemeDocumentMapper schemeDocumentMapper;


    public SchemeDetails dtoToEntity(SchemeDetailsDto schemeDetailsDto) {
        SchemeDetails schemeDetails = new SchemeDetails();
        schemeDetails.setSchemeImage(schemeDetailsDto.getSchemeImage());
        schemeDetails.setDescription(schemeDetailsDto.getDescription());
        schemeDetails.setMinAmount(schemeDetailsDto.getMinAmount());
        schemeDetails.setMaxAmount(schemeDetailsDto.getMaxAmount());
        schemeDetails.setMinInvestmentTime(schemeDetailsDto.getMinInvestmentTime());
        schemeDetails.setMaxInvestmentTime(schemeDetailsDto.getMaxInvestmentTime());
        schemeDetails.setMinAge(schemeDetailsDto.getMinAge());
        schemeDetails.setMaxAge(schemeDetailsDto.getMaxAge());
        schemeDetails.setProfitRatio(schemeDetailsDto.getProfitRatio());
        schemeDetails.setRegistrationCommissionRatio(schemeDetailsDto.getRegistrationCommissionAmount());
        schemeDetails.setInstallmentCommissionRatio(schemeDetailsDto.getInstallmentCommissionRatio());
        schemeDetails.setDocuments(schemeDocumentMapper.getEntityList(schemeDetailsDto.getDocuments()));

        return schemeDetails;
    }

    public SchemeDetailsDto entityToDto(SchemeDetails schemeDetails) {
        SchemeDetailsDto schemeDetailsDto = new SchemeDetailsDto();
        schemeDetailsDto.setId(schemeDetails.getId());
        schemeDetailsDto.setSchemeImage(schemeDetails.getSchemeImage());
        schemeDetailsDto.setDescription(schemeDetails.getDescription());
        schemeDetailsDto.setMinAmount(schemeDetails.getMinAmount());
        schemeDetailsDto.setMaxAmount(schemeDetails.getMaxAmount());
        schemeDetailsDto.setMinInvestmentTime(schemeDetails.getMinInvestmentTime());
        schemeDetailsDto.setMaxInvestmentTime(schemeDetails.getMaxInvestmentTime());
        schemeDetailsDto.setMinAge(schemeDetails.getMinAge());
        schemeDetailsDto.setMaxAge(schemeDetails.getMaxAge());
        schemeDetailsDto.setProfitRatio(schemeDetails.getProfitRatio());
        schemeDetailsDto.setRegistrationCommissionAmount(schemeDetails.getRegistrationCommissionRatio());
        schemeDetailsDto.setInstallmentCommissionRatio(schemeDetails.getInstallmentCommissionRatio());
        schemeDetailsDto.setDocuments(schemeDocumentMapper.getDtoList(schemeDetails.getDocuments()));

        return schemeDetailsDto;
    }


    public List<SchemeDetails> getEntityList(List<SchemeDetailsDto> schemeDetailsDtoList) {
        List<SchemeDetails> schemeDetailsList = new ArrayList<>();
        for (SchemeDetailsDto schemeDetailsDto : schemeDetailsDtoList) {
            schemeDetailsList.add(dtoToEntity(schemeDetailsDto));
        }

        return schemeDetailsList;
    }

    public List<SchemeDetailsDto> getDtoList(List<SchemeDetails> schemeDetailsList) {
        List<SchemeDetailsDto> schemeDetailsDtoList = new ArrayList<>();
        for (SchemeDetails schemeDetails : schemeDetailsList) {
            schemeDetailsDtoList.add(entityToDto(schemeDetails));
        }

        return schemeDetailsDtoList;
    }
}
