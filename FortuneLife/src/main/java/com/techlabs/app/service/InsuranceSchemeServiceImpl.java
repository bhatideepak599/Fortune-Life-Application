package com.techlabs.app.service;

import com.techlabs.app.dto.CityDto;
import com.techlabs.app.dto.RequestSchemeDto;
import com.techlabs.app.dto.SchemeDocumentDto;
import com.techlabs.app.dto.SchemeDto;
import com.techlabs.app.entity.*;
import com.techlabs.app.exception.InsurancePlanException;
import com.techlabs.app.exception.SchemeRelatedException;
import com.techlabs.app.mapper.SchemeDocumentMapper;
import com.techlabs.app.mapper.SchemeMapper;
import com.techlabs.app.repository.InsurancePlanRepository;
import com.techlabs.app.repository.SchemeDetailsRepository;
import com.techlabs.app.repository.SchemeDocumentRepository;
import com.techlabs.app.repository.SchemeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class InsuranceSchemeServiceImpl implements InsuranceSchemeService {
	@Autowired
	private SchemeRepository schemeRepository;

	@Autowired
	private InsurancePlanRepository planRepository;

	@Autowired
	private SchemeMapper schemeMapper;

	@Autowired
	private SchemeDocumentMapper documentMapper;

	@Autowired
	private SchemeDocumentRepository documentRepository;

	@Autowired
	private SchemeDetailsRepository detailsRepository;

	@Autowired
	private FileService fileService;

	@Override
	public List<SchemeDto> getAllSchemesByPlanId(Long planId) {
		InsurancePlan insurancePlan = planRepository.findById(planId).orElseThrow(
				() -> new InsurancePlanException("Insurance plan with ID : " + planId + " cannot be found"));

		if (!insurancePlan.getActive()) {
			throw new InsurancePlanException("Insurance plan with ID : " + planId + " is not active");
		}

		List<InsuranceScheme> schemes = insurancePlan.getSchemes();
		if (schemes.isEmpty()) {
			throw new SchemeRelatedException("Insurance schemes cannot be found");
		}

		return schemeMapper.getDtoList(schemes);
	}

	@Override
	public SchemeDto getSchemeByPlanId(Long planId, Long id) {
		InsurancePlan insurancePlan = planRepository.findById(planId).orElseThrow(
				() -> new InsurancePlanException("Insurance plan with ID : " + planId + " cannot be found"));

		if (!insurancePlan.getActive()) {
			throw new InsurancePlanException("Insurance plan with ID : " + planId + " is not active");
		}

		InsuranceScheme insuranceScheme = planRepository.findSchemeByPlanIdAndSchemeId(planId, id)
				.orElseThrow(() -> new SchemeRelatedException(
						"Scheme with ID : " + id + " in a Insurance plan with ID : " + planId + " cannot be found"));

		return schemeMapper.entityToDto(insuranceScheme);
	}

	@Override
	public SchemeDto createScheme(RequestSchemeDto schemeDto, Long planId) {
		InsurancePlan insurancePlan = planRepository.findById(planId).orElseThrow(
				() -> new InsurancePlanException("Insurance plan with ID : " + planId + " cannot be found"));

		if (!insurancePlan.getActive()) {
			throw new InsurancePlanException("Insurance plan with ID : " + planId + " is not active");
		}

		InsuranceScheme insuranceScheme = new InsuranceScheme();
		insuranceScheme.setActive(true);
		insuranceScheme.setSchemeName(schemeDto.getSchemeName());

		List<InsurancePolicy> policies = new ArrayList<>();
		insuranceScheme.setPolicies(policies);

		SchemeDetails schemeDetails = new SchemeDetails();
		schemeDetails.setSchemeImage(schemeDto.getSchemeImage());
		schemeDetails.setDescription(schemeDto.getDescription());
		schemeDetails.setMinAmount(schemeDto.getMinAmount());
		schemeDetails.setMaxAmount(schemeDto.getMaxAmount());
		schemeDetails.setMinInvestmentTime(schemeDto.getMinInvestmentTime());
		schemeDetails.setMaxInvestmentTime(schemeDto.getMaxInvestmentTime());
		schemeDetails.setMinAge(schemeDto.getMinAge());
		schemeDetails.setMaxAge(schemeDto.getMaxAge());
		schemeDetails.setProfitRatio(schemeDto.getProfitRatio());
		schemeDetails.setRegistrationCommissionRatio(schemeDto.getRegistrationCommissionRatio());
		schemeDetails.setInstallmentCommissionRatio(schemeDto.getInstallmentCommissionRatio());

		Set<SchemeDocument> documents = new HashSet<>();
		for (SchemeDocumentDto document : schemeDto.getDocuments()) {
			documents.add(documentRepository.save(documentMapper.dtoToEntity(document)));
		}

		schemeDetails.setDocuments(documents);
		SchemeDetails savedDetails = detailsRepository.save(schemeDetails);

		insuranceScheme.setSchemeDetails(savedDetails);
		InsuranceScheme savedScheme = schemeRepository.save(insuranceScheme);

		insurancePlan.getSchemes().add(savedScheme);
		planRepository.save(insurancePlan);

		return schemeMapper.entityToDto(savedScheme);
	}

	@Override
	public SchemeDto updateScheme(RequestSchemeDto schemeDto, Long planId) {
		InsurancePlan insurancePlan = planRepository.findById(planId).orElseThrow(
				() -> new InsurancePlanException("Insurance plan with ID : " + planId + " cannot be found"));

		if (!insurancePlan.getActive()) {
			throw new InsurancePlanException("Insurance plan with ID : " + planId + " is not active");
		}

		InsuranceScheme insuranceScheme = schemeRepository.findById(schemeDto.getSchemeId())
				.orElseThrow(() -> new SchemeRelatedException(
						"Insurance Scheme with ID : " + schemeDto.getSchemeId() + " cannot be found"));

		if (!insuranceScheme.getActive()) {
			throw new SchemeRelatedException(
					"Insurance Scheme with ID : " + schemeDto.getSchemeId() + " is not active");
		}

		insuranceScheme.setActive(schemeDto.getActive());
		insuranceScheme.setSchemeName(schemeDto.getSchemeName());

		SchemeDetails schemeDetails = insuranceScheme.getSchemeDetails();
		System.out.println(schemeDto.getSchemeImage()
				+ "=========================================================================================");
		schemeDetails.setSchemeImage(schemeDto.getSchemeImage());
		schemeDetails.setDescription(schemeDto.getDescription());
		schemeDetails.setMinAmount(schemeDto.getMinAmount());
		schemeDetails.setMaxAmount(schemeDto.getMaxAmount());
		schemeDetails.setMinInvestmentTime(schemeDto.getMinInvestmentTime());
		schemeDetails.setMaxInvestmentTime(schemeDto.getMaxInvestmentTime());
		schemeDetails.setMinAge(schemeDto.getMinAge());
		schemeDetails.setMaxAge(schemeDto.getMaxAge());
		schemeDetails.setProfitRatio(schemeDto.getProfitRatio());
		schemeDetails.setRegistrationCommissionRatio(schemeDto.getRegistrationCommissionRatio());
		schemeDetails.setInstallmentCommissionRatio(schemeDto.getInstallmentCommissionRatio());

		Set<SchemeDocument> documents = updateSchemeDocuments(schemeDetails, schemeDto);
		schemeDetails.setDocuments(documents);
		SchemeDetails savedDetails = detailsRepository.save(schemeDetails);

		insuranceScheme.setSchemeDetails(savedDetails);
		InsuranceScheme savedScheme = schemeRepository.save(insuranceScheme);

		return schemeMapper.entityToDto(savedScheme);
	}

	private Set<SchemeDocument> updateSchemeDocuments(SchemeDetails schemeDetails, RequestSchemeDto schemeDto) {
		Set<SchemeDocument> documents = schemeDetails.getDocuments();

		for (SchemeDocumentDto documentDto : schemeDto.getDocuments()) {
			SchemeDocument existingDocument = documentRepository.findById(documentDto.getId())
					.orElseThrow(() -> new SchemeRelatedException(
							"Scheme document with ID : " + documentDto.getId() + " " + "cannot be found"));

			existingDocument.setDocumentName(documentDto.getDocumentName());
			documentRepository.save(existingDocument);
		}

		return documents;
	}

	@Override
	public String deleteScheme(Long planId, Long id) {
		InsurancePlan insurancePlan = planRepository.findById(planId).orElseThrow(
				() -> new InsurancePlanException("Insurance plan with ID : " + planId + " cannot be found"));

		if (!insurancePlan.getActive()) {
			throw new InsurancePlanException("Insurance plan with ID : " + planId + " is not active");
		}

		InsuranceScheme insuranceScheme = schemeRepository.findById(id)
				.orElseThrow(() -> new SchemeRelatedException("Insurance Scheme with ID : " + id + " cannot be found"));

		if (!insuranceScheme.getActive()) {
			throw new SchemeRelatedException("Insurance Scheme with ID : " + id + " is not active");
		}

		insuranceScheme.setActive(false);
		schemeRepository.save(insuranceScheme);

		return "Insurance scheme with ID" + id + " deleted successfully";
	}

	@Override
	public String activateScheme(Long planId, Long id) {
		InsurancePlan insurancePlan = planRepository.findById(planId).orElseThrow(
				() -> new InsurancePlanException("Insurance plan with ID : " + planId + " cannot be found"));

		if (!insurancePlan.getActive()) {
			throw new InsurancePlanException("Insurance plan with ID : " + planId + " is not active");
		}

		InsuranceScheme insuranceScheme = schemeRepository.findById(id)
				.orElseThrow(() -> new SchemeRelatedException("Insurance Scheme with ID : " + id + " cannot be found"));

		if (insuranceScheme.getActive()) {
			throw new SchemeRelatedException("Insurance Scheme with ID : " + id + " is already active");
		}

		insuranceScheme.setActive(true);
		schemeRepository.save(insuranceScheme);

		return "Insurance scheme with ID" + id + " activated successfully";
	}

	@Override
	public SchemeDto updateCommission(Long planId, Long id, Double installmentRatio, Double registrationAmount,
			Double profitRatio) {
		InsurancePlan insurancePlan = planRepository.findById(planId).orElseThrow(
				() -> new InsurancePlanException("Insurance plan with ID : " + planId + " cannot be found"));

		if (!insurancePlan.getActive()) {
			throw new InsurancePlanException("Insurance plan with ID : " + planId + " is not active");
		}

		InsuranceScheme insuranceScheme = schemeRepository.findById(id)
				.orElseThrow(() -> new SchemeRelatedException("Insurance Scheme with ID : " + id + " cannot be found"));

		if (!insuranceScheme.getActive()) {
			throw new SchemeRelatedException("Insurance Scheme with ID : " + id + " is not active");
		}

		SchemeDetails schemeDetails = insuranceScheme.getSchemeDetails();
		schemeDetails.setProfitRatio(profitRatio);
		schemeDetails.setRegistrationCommissionRatio(registrationAmount);
		schemeDetails.setInstallmentCommissionRatio(installmentRatio);

		detailsRepository.save(schemeDetails);

		return schemeMapper.entityToDto(insuranceScheme);
	}

	@Override
	public SchemeDto updateSchemeImage(Long planId, Long id, String schemeImage) {
		InsurancePlan insurancePlan = planRepository.findById(planId).orElseThrow(
				() -> new InsurancePlanException("Insurance plan with ID : " + planId + " cannot be found"));

		if (!insurancePlan.getActive()) {
			throw new InsurancePlanException("Insurance plan with ID : " + planId + " is not active");
		}

		InsuranceScheme insuranceScheme = schemeRepository.findById(id)
				.orElseThrow(() -> new SchemeRelatedException("Insurance Scheme with ID : " + id + " cannot be found"));

		SchemeDetails schemeDetails = insuranceScheme.getSchemeDetails();
		schemeDetails.setSchemeImage(schemeImage);
		detailsRepository.save(schemeDetails);

		return schemeMapper.entityToDto(insuranceScheme);

	}

	@Override
	public List<SchemeDto> getAllSchemes() {
		List<InsuranceScheme> allSchemes = schemeRepository.findAll();

		List<SchemeDto> schemesDto = new ArrayList<>();
		allSchemes.forEach(scheme -> {
			SchemeDto dto = new SchemeDto();
			dto.setId(scheme.getId());
			dto.setSchemeName(scheme.getSchemeName());
			dto.setActive(scheme.getActive());

			Set<CityDto> cities = new HashSet<>();
			scheme.getCities().forEach(city -> {
				CityDto cityDto = new CityDto();
				cityDto.setPincode(city.getPincode());
				cityDto.setActive(city.getActive());
				cityDto.setName(city.getName());
				cities.add(cityDto);
			});
			dto.setCitiesDto(cities);

			schemesDto.add(dto);
		});

		return schemesDto;
	}
}
