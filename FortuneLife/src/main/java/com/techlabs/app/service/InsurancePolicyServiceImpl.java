package com.techlabs.app.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.techlabs.app.enums.PremiumType;
import com.techlabs.app.exception.FortuneLifeException;
import com.techlabs.app.util.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.techlabs.app.dto.CommissionDto;
import com.techlabs.app.dto.CustomerDto;
import com.techlabs.app.dto.InsurancePolicyDto;
import com.techlabs.app.dto.InsurancePolicyResponseDto;
import com.techlabs.app.dto.SubmittedDocumentDto;
import com.techlabs.app.entity.Agent;
import com.techlabs.app.entity.Commission;
import com.techlabs.app.entity.Customer;
import com.techlabs.app.entity.InsurancePolicy;
import com.techlabs.app.entity.InsuranceScheme;
import com.techlabs.app.entity.Nominee;
import com.techlabs.app.entity.SubmittedDocument;
import com.techlabs.app.enums.CommissionType;
import com.techlabs.app.enums.DocumentStatus;
import com.techlabs.app.enums.PolicyStatus;
import com.techlabs.app.exception.AgentRelatedException;
import com.techlabs.app.exception.CustomerRelatedException;
import com.techlabs.app.exception.SchemeRelatedException;
import com.techlabs.app.mapper.InsurancePolicyMapper;
import com.techlabs.app.repository.AgentRepository;
import com.techlabs.app.repository.CommissionRepository;
import com.techlabs.app.repository.CustomerRepository;
import com.techlabs.app.repository.InsurancePolicyRepository;
import com.techlabs.app.repository.NomineeRepository;
import com.techlabs.app.repository.SchemeRepository;
import com.techlabs.app.repository.SubmittedDocumentRepository;

@Service
public class InsurancePolicyServiceImpl implements InsurancePolicyService {
	private SchemeRepository schemeRepository;
	private CustomerRepository customerRepository;
	private InsurancePolicyRepository insurancePolicyRepository;
	private NomineeRepository nomineeRepository;
	private SubmittedDocumentRepository documentRepository;
	private InsurancePolicyMapper insurancePolicyMapper;
	private AgentRepository agentRepository;
	private CommissionRepository commissionRepository;

	public InsurancePolicyServiceImpl(SchemeRepository schemeRepository, CustomerRepository customerRepository,
			InsurancePolicyRepository insurancePolicyRepository, NomineeRepository nomineeRepository,
			SubmittedDocumentRepository documentRepository, InsurancePolicyMapper insurancePolicyMapper,
			AgentRepository agentRepository, CommissionRepository commissionRepository) {
		super();
		this.schemeRepository = schemeRepository;
		this.customerRepository = customerRepository;
		this.insurancePolicyRepository = insurancePolicyRepository;
		this.nomineeRepository = nomineeRepository;
		this.documentRepository = documentRepository;
		this.insurancePolicyMapper = insurancePolicyMapper;
		this.agentRepository = agentRepository;
		this.commissionRepository = commissionRepository;
	}

	@Override
	public InsurancePolicyResponseDto addNewPolicy(Long customerId, Long schemeId,
			InsurancePolicyDto insurancePolicyDto) {
		Customer customer = customerRepository.findById(customerId)
				.orElseThrow(() -> new CustomerRelatedException("No Customer Found With Customer Id: " + customerId));
		if (!customer.getActive())
			throw new CustomerRelatedException("No Customer Found With Customer Id: " + customerId);

		InsuranceScheme insuranceScheme = schemeRepository.findById(schemeId)
				.orElseThrow(() -> new SchemeRelatedException("No Scheme Found With Scheme Id: " + schemeId));
		if (!insuranceScheme.getActive()) {
			throw new SchemeRelatedException("Scheme Is Not Active Now ");
		}

		InsurancePolicy insurancePolicy = getEntity(insuranceScheme, insurancePolicyDto);
		insurancePolicy.setCustomer(customer);
		insurancePolicy = insurancePolicyRepository.save(insurancePolicy);

		List<InsurancePolicy> insuranceSchemeAllPolicies = insuranceScheme.getPolicies();
		insuranceSchemeAllPolicies.add(insurancePolicy);
		schemeRepository.save(insuranceScheme);

		List<InsurancePolicy> policies = customer.getPolicies();
		policies.add(insurancePolicy);
		customer.setPolicies(policies);
		customer = customerRepository.save(customer);

		return insurancePolicyMapper.entityToDto(insurancePolicy);
	}

	@Override
	public InsurancePolicyResponseDto addNewPolicyByAgentForCustomer(Long customerId, Long schemeId, Long agentId,
			InsurancePolicyDto insurancePolicyDto) {
		Agent agent = agentRepository.findById(agentId)
				.orElseThrow(() -> new AgentRelatedException("No Agent Found with Agent Id:" + agentId));

		Customer customer = customerRepository.findById(customerId)
				.orElseThrow(() -> new CustomerRelatedException("No Customer Found With Customer Id: " + customerId));
		if (!customer.getActive())
			throw new CustomerRelatedException("No Customer Found With Customer Id: " + customerId);

		InsuranceScheme insuranceScheme = schemeRepository.findById(schemeId)
				.orElseThrow(() -> new SchemeRelatedException("No Scheme Found With Scheme Id: " + schemeId));
		if (!insuranceScheme.getActive()) {
			throw new SchemeRelatedException("Scheme Is Not Active Now ");
		}

		InsurancePolicy insurancePolicy = getEntity(insuranceScheme, insurancePolicyDto);
		insurancePolicy.setAgent(agent);
		insurancePolicy.setCustomer(customer);
		insurancePolicy = insurancePolicyRepository.save(insurancePolicy);

		Double registrationCommission = insuranceScheme.getSchemeDetails().getRegistrationCommissionRatio();

		Commission commission = new Commission();
		Double commissionAmount = registrationCommission;
		commission.setAmount(commissionAmount);
		commission.setCommissionType(CommissionType.REGISTRATION.name());
		commission.setIssueDate(LocalDateTime.now());

		agent.setTotalCommission(commissionAmount + agent.getTotalCommission());
		commission.setPolicyId(insurancePolicy.getId());
		commission.setAgent(agent);
		commission = commissionRepository.save(commission);

		List<Commission> commissions = agent.getCommissions();
		commissions.add(commission);
		agent.setCommissions(commissions);
		agentRepository.save(agent);

		List<InsurancePolicy> insuranceSchemeAllPolicies = insuranceScheme.getPolicies();
		insuranceSchemeAllPolicies.add(insurancePolicy);
		schemeRepository.save(insuranceScheme);

		List<InsurancePolicy> policies = customer.getPolicies();
		policies.add(insurancePolicy);
		customer.setPolicies(policies);
		customer = customerRepository.save(customer);

		return insurancePolicyMapper.entityToDto(insurancePolicy);
	}

	private InsurancePolicy getEntity(InsuranceScheme insuranceScheme, InsurancePolicyDto insurancePolicyDto) {

		InsurancePolicy insurancePolicy = new InsurancePolicy();

		Double sumAssured = 100 + insuranceScheme.getSchemeDetails().getProfitRatio();
		sumAssured = insurancePolicyDto.getPolicyAmount() * 0.01 * sumAssured;

		insurancePolicy.setTotalPolicyAmount(insurancePolicyDto.getPolicyAmount());
		insurancePolicy.setIssueDate(LocalDate.now());
		insurancePolicy.setMaturityDate(LocalDate.now().plusYears(insurancePolicyDto.getTime()));
		insurancePolicy.setInsuranceScheme(insuranceScheme);
		insurancePolicy.setPremiumAmount(insurancePolicyDto.getPremiumAmount());

		switch (insurancePolicyDto.getPremiumType()) {
		case "12" -> insurancePolicy.setPremiumType(PremiumType.YEARLY.name());
		case "6" -> insurancePolicy.setPremiumType(PremiumType.HALF_YEARLY.name());
		case "3" -> insurancePolicy.setPremiumType(PremiumType.QUARTERLY.name());
		case "1" -> insurancePolicy.setPremiumType(PremiumType.MONTHLY.name());
		default -> throw new FortuneLifeException("Choose correct Premium Type");
		}

		insurancePolicy.setSumAssured(sumAssured);
		insurancePolicy.setPolicyStatus(PolicyStatus.PENDING.name());
		insurancePolicy.setPayments(new ArrayList<>());

		Set<SubmittedDocument> documents = new HashSet<>();

		for (SubmittedDocumentDto dto : insurancePolicyDto.getSubmittedDocumentsDto()) {
			SubmittedDocument submittedDocument = new SubmittedDocument();
			submittedDocument.setDocumentImage(dto.getDocumentImage());
			submittedDocument.setDocumentName(dto.getDocumentName());
			submittedDocument.setDocumentStatus(DocumentStatus.PENDING.name());

			submittedDocument = documentRepository.save(submittedDocument);
			documents.add(submittedDocument);
		}

		Nominee nominee = new Nominee();
		nominee.setNomineeName(insurancePolicyDto.getNomineeName());
		nominee.setRelationStatus(insurancePolicyDto.getRelationStatusWithNominee());

		nominee = nomineeRepository.save(nominee);

		List<Nominee> nominees = new ArrayList<>();
		nominees.add(nominee);
		insurancePolicy.setNominees(nominees);
		insurancePolicy.setSubmittedDocuments(documents);
		return insurancePolicy;
	}

	@Override
	public InsurancePolicyResponseDto getPolicyById(Long policyId) {
		InsurancePolicy insurancePolicy = insurancePolicyRepository.findById(policyId)
				.orElseThrow(() -> new FortuneLifeException("No Policy Found With ID: " + policyId));
		return insurancePolicyMapper.entityToDto(insurancePolicy);
	}

	public PageResponse<InsurancePolicyResponseDto> getAllPolicies(Long id, Long customerId, Long agentId,
			Long schemeId, String schemeName, String customerName, String policyStatus, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		Page<InsurancePolicy> policies = insurancePolicyRepository.findAllPoliciesBasedOnSearch(id, customerId, agentId,
				schemeId, schemeName, customerName, policyStatus, pageable);
//	    
//	    Page<InsurancePolicy> policies = insurancePolicyRepository.findPoliciesWithJoins(id, pageable);
		if (policies.isEmpty()) {
			throw new FortuneLifeException("No Policies Found!");
		}

		List<InsurancePolicyResponseDto> response = policies.getContent().stream()
				.map(insurancePolicyMapper::entityToDto).collect(Collectors.toList());

		return new PageResponse<>(response, policies.getNumber(), policies.getNumberOfElements(),
				policies.getTotalElements(), policies.getTotalPages(), policies.isLast());
	}

	@Override
	public PageResponse<CommissionDto> getAllCommissions(Long id, Long policyId, Long agentId, String commissionType,
			String customerName, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		Page<Commission> commissions = commissionRepository.findByCriteria(id, policyId, agentId, commissionType,
				customerName, pageable);
		if (commissions.isEmpty()) {
			throw new FortuneLifeException("No Policies Found!");
		}

		List<CommissionDto> response =null;// commissions.getContent().stream()
				//.map(insurancePolicyMapper::entityToDto).collect(Collectors.toList());

		return new PageResponse<>(response, commissions.getNumber(), commissions.getNumberOfElements(),
				commissions.getTotalElements(), commissions.getTotalPages(), commissions.isLast());
	}

}
