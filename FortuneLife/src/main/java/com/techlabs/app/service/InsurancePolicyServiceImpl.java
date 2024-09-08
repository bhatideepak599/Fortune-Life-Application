package com.techlabs.app.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.techlabs.app.enums.PremiumType;
import com.techlabs.app.exception.FortuneLifeException;
import org.springframework.stereotype.Service;

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
        insurancePolicy = insurancePolicyRepository.save(insurancePolicy);

        Double registrationCommission = insuranceScheme.getSchemeDetails().getRegistrationCommissionRatio();

        Commission commission = new Commission();
        Double commissionAmount = registrationCommission;
        commission.setAmount(commissionAmount);
        commission.setCommissionType(CommissionType.REGISTRATION.name());
        commission.setIssueDate(LocalDateTime.now());

        agent.setTotalCommission(commissionAmount + agent.getTotalCommission());
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
        insurancePolicy.setPolicyStatus(PolicyStatus.ACTIVE.name());
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
}
