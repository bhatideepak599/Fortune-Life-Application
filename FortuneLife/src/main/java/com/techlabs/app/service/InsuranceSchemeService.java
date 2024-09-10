package com.techlabs.app.service;

import com.techlabs.app.dto.RequestSchemeDto;
import com.techlabs.app.dto.SchemeDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface InsuranceSchemeService {
    List<SchemeDto> getAllSchemesByPlanId(Long planId);

    SchemeDto getSchemeByPlanId(Long planId, Long id);

    SchemeDto createScheme(RequestSchemeDto schemeDto, Long planId);


    SchemeDto updateScheme(RequestSchemeDto schemeDto, Long planId);



    String deleteScheme(Long planId, Long id);

    String activateScheme(Long planId, Long id);

    SchemeDto updateCommission(Long planId, Long id, Double installmentRatio, Double registrationAmount, Double profitRatio);

    SchemeDto updateSchemeImage(Long planId, Long id, String schemeImage);

	List<SchemeDto> getAllSchemes();
}
