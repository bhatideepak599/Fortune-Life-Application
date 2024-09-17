package com.techlabs.app.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import com.techlabs.app.dto.*;
import com.techlabs.app.enums.PremiumType;
import com.techlabs.app.exception.FortuneLifeException;
import com.techlabs.app.util.PageResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

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
    @Autowired
    private AuthService authService;

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

        Set<SubmittedDocument> submittedDocuments = insurancePolicy.getSubmittedDocuments();
        Set<SubmittedDocument> verificationDocuments = new HashSet<>();
        for (SubmittedDocument submittedDocument : submittedDocuments) {
            if (insurancePolicy.getAgent() != null && insurancePolicy.getAgent().getId() != null) {
                submittedDocument.setDocumentStatus(DocumentStatus.APPROVED.name());
            } else {
                submittedDocument.setDocumentStatus(DocumentStatus.PENDING.name());
            }
            verificationDocuments.add(documentRepository.save(submittedDocument));
        }

        boolean allApproved = verificationDocuments.stream()
                .allMatch(doc -> "APPROVED".equalsIgnoreCase(doc.getDocumentStatus()));


        insurancePolicy.setVerified(allApproved);

        if (insurancePolicy.getVerified()) {
            insurancePolicy.setPolicyStatus(PolicyStatus.ACTIVE.name());
        } else {
            insurancePolicy.setPolicyStatus(PolicyStatus.PENDING.name());
        }


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

    @Override
    public PageResponse<InsurancePolicyResponseDto> getAllPolicies(Long id, Long customerId, Long agentId,
                                                                   Long schemeId, String schemeName, String customerName,
                                                                   String policyStatus, Boolean verified, int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        // Update repository call to include 'verified' in the search criteria
        Page<InsurancePolicy> policies = insurancePolicyRepository.findAllPoliciesBasedOnCritaria(
                id, customerId, agentId, schemeId, schemeName, customerName, policyStatus, verified, pageable);

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
            throw new FortuneLifeException("No Commissions Found!");
        }

        List<CommissionDto> response = commissions.getContent().stream()
                .map(insurancePolicyMapper::commissionEntityToDto).collect(Collectors.toList());

        return new PageResponse<>(response, commissions.getNumber(), commissions.getNumberOfElements(),
                commissions.getTotalElements(), commissions.getTotalPages(), commissions.isLast());
    }

    @Override
    public PageResponse<CommissionDto> getAllCommissionsOfAnAgent(Long id, Long policyId, String commissionType, int page, int size, HttpServletRequest request) {
        Pageable pageable = PageRequest.of(page, size);
        UserDto user = authService.getLoggedUser(request);
        Long agentId = user.getId();
        String customerName = null;
        Page<Commission> commissions = commissionRepository.findByCriteria(id, policyId, agentId, commissionType,
                customerName, pageable);
        if (commissions.isEmpty()) {
            throw new FortuneLifeException("No Commissions Found!");
        }

        List<CommissionDto> response = commissions.getContent().stream()
                .map(insurancePolicyMapper::commissionEntityToDto).collect(Collectors.toList());

        return new PageResponse<>(response, commissions.getNumber(), commissions.getNumberOfElements(),
                commissions.getTotalElements(), commissions.getTotalPages(), commissions.isLast());
    }

    @Override
    public PageResponse<InsurancePolicyResponseDto> getAllPoliciesUnderAnAgent(Long id, Long customerId, String name,
                                                                               String policyStatus, int page, int size, HttpServletRequest request) {
        UserDto user = authService.getLoggedUser(request);
        Long agentId = user.getId();
        Pageable pageable = PageRequest.of(page, size);
        Page<InsurancePolicy> policies = insurancePolicyRepository.findAllPoliciesBasedOnSearch(id, customerId, agentId,
                null, null, name, policyStatus, pageable);


        if (policies.isEmpty()) {
            throw new FortuneLifeException("No Policies Found!");
        }

        List<InsurancePolicyResponseDto> response = policies.getContent().stream()
                .map(insurancePolicyMapper::entityToDto).collect(Collectors.toList());

        return new PageResponse<>(response, policies.getNumber(), policies.getNumberOfElements(),
                policies.getTotalElements(), policies.getTotalPages(), policies.isLast());
    }

    @Override
    public List<PolicyReport> getPolicyReport() {
        return insurancePolicyRepository.getPolicyReport();
    }

    @Transactional
    @Override
    public InsurancePolicyResponseDto updateSubmittedDocuments(Long policyId, List<SubmittedDocumentDto> documentDtos) {

        InsurancePolicy insurancePolicy = insurancePolicyRepository.findById(policyId)
                .orElseThrow(() -> new FortuneLifeException("No Policy Found With ID: " + policyId));

        Set<SubmittedDocument> existingDocuments = insurancePolicy.getSubmittedDocuments();


        Map<Long, SubmittedDocument> documentMap = existingDocuments.stream()
                .collect(Collectors.toMap(SubmittedDocument::getId, document -> document));


        Set<SubmittedDocument> updatedDocuments = new HashSet<>();
        for (SubmittedDocumentDto dto : documentDtos) {
            SubmittedDocument document;
            if (dto.getId() != null && documentMap.containsKey(dto.getId())) {

                document = documentMap.get(dto.getId());
                document.setDocumentName(dto.getDocumentName());
                document.setDocumentStatus(dto.getDocumentStatus());
                document.setDocumentImage(dto.getDocumentImage());
            } else {

                document = new SubmittedDocument();
                document.setDocumentName(dto.getDocumentName());
                document.setDocumentStatus(dto.getDocumentStatus());
                document.setDocumentImage(dto.getDocumentImage());
            }

            document = documentRepository.save(document);
            updatedDocuments.add(document);
        }


        insurancePolicy.setSubmittedDocuments(updatedDocuments);
        insurancePolicy = insurancePolicyRepository.save(insurancePolicy);


        return insurancePolicyMapper.entityToDto(insurancePolicy);
    }

    @Override
    public InsurancePolicyResponseDto verifyPolicyDocuments(Long policyId, List<SubmittedDocumentDto> documentDtos) {
        InsurancePolicy insurancePolicy = insurancePolicyRepository.findById(policyId)
                .orElseThrow(() -> new FortuneLifeException("No Policy Found With ID: " + policyId));

        Set<SubmittedDocument> existingDocuments = insurancePolicy.getSubmittedDocuments();

        Map<Long, SubmittedDocument> documentMap = existingDocuments.stream()
                .collect(Collectors.toMap(SubmittedDocument::getId, document -> document));

        Set<SubmittedDocument> updatedDocuments = new HashSet<>();
        for (SubmittedDocumentDto dto : documentDtos) {
            SubmittedDocument document = null;
            if (dto.getId() != null && documentMap.containsKey(dto.getId())) {

                document = documentMap.get(dto.getId());
                document.setDocumentName(dto.getDocumentName());
                document.setDocumentStatus(dto.getDocumentStatus());
                document.setDocumentImage(dto.getDocumentImage());
            }

            document = documentRepository.save(document);
            updatedDocuments.add(document);
        }


        insurancePolicy.setSubmittedDocuments(updatedDocuments);


        boolean allApproved = updatedDocuments.stream()
                .allMatch(doc -> "APPROVED".equalsIgnoreCase(doc.getDocumentStatus()));


        insurancePolicy.setVerified(allApproved);

        if (insurancePolicy.getVerified()) {
            insurancePolicy.setPolicyStatus(PolicyStatus.ACTIVE.name());
        } else {
            insurancePolicy.setPolicyStatus(PolicyStatus.PENDING.name());
        }


        insurancePolicy = insurancePolicyRepository.save(insurancePolicy);


        return insurancePolicyMapper.entityToDto(insurancePolicy);
    }

}
