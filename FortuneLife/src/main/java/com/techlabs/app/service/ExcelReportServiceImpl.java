package com.techlabs.app.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import com.techlabs.app.entity.Address;
import com.techlabs.app.entity.Agent;
import com.techlabs.app.entity.Customer;
import com.techlabs.app.entity.InsurancePolicy;
import com.techlabs.app.entity.InsuranceScheme;
import com.techlabs.app.entity.Nominee;
import com.techlabs.app.entity.User;
import com.techlabs.app.exception.CustomerRelatedException;
import com.techlabs.app.repository.AgentRepository;
import com.techlabs.app.repository.CustomerRepository;

@Service
public class ExcelReportServiceImpl implements ExcelReportService {
	 	private final CustomerRepository customerRepository;

	    public ExcelReportServiceImpl(CustomerRepository customerRepository) {
	        this.customerRepository = customerRepository;
	    }

	    public ByteArrayResource createExcelFile() throws IOException {
	        List<Customer> customers = customerRepository.findAll();
	        if (customers == null || customers.isEmpty()) {
	            throw new CustomerRelatedException("No Customers Available");
	        }

	        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
	             Workbook workbook = new XSSFWorkbook()) {

	            Sheet sheet = workbook.createSheet("Customer Report");

	            // Create header row
	            Row headerRow = sheet.createRow(0);
	            String[] headers = {
	                "Customer ID", "Username", "First Name", "Last Name", "Email", "Gender", "Mobile Number",
	                "House Number", "Apartment", "City", "State", "Pin Code",
	                "Policy ID", "Policy Issue Date", "Policy Maturity Date", "Premium Type", "Sum Assured", 
	                "Premium Amount", "Policy Status", "Scheme Name", "Agent Name", "Agent Mobile Number", 
	                "Nominee ID", "Nominee Name", "Nominee Relation"
	            };
	            for (int i = 0; i < headers.length; i++) {
	                Cell cell = headerRow.createCell(i);
	                cell.setCellValue(headers[i]);
	            }

	            // Add customer data to the sheet
	            int rowNum = 1;
	            for (Customer customer : customers) {
	                Row row = sheet.createRow(rowNum++);

	                User user = customer.getUser();
	                Address address = user.getAddress();
	                
	                row.createCell(0).setCellValue(customer.getId());
	                row.createCell(1).setCellValue(user.getUsername());
	                row.createCell(2).setCellValue(user.getFirstName());
	                row.createCell(3).setCellValue(user.getLastName());
	                row.createCell(4).setCellValue(user.getEmail());
	                row.createCell(5).setCellValue(user.getGender());
	                row.createCell(6).setCellValue(user.getMobileNumber());

	                row.createCell(7).setCellValue(address.getHouseNumber());
	                row.createCell(8).setCellValue(address.getApartment());
	                row.createCell(9).setCellValue(address.getCity());
	                row.createCell(10).setCellValue(address.getState());
	                row.createCell(11).setCellValue(address.getPinCode());

	                int policyColumn = 12;
	                int cnt=1;
	                for (InsurancePolicy policy : customer.getPolicies()) {
	                	if(cnt>1)  {
	                		 row = sheet.createRow(rowNum++);
	                		 policyColumn = 12;
	                	}
	                	cnt++;
	                    row.createCell(policyColumn++).setCellValue(policy.getId());
	                    row.createCell(policyColumn++).setCellValue(policy.getIssueDate().toString());
	                    row.createCell(policyColumn++).setCellValue(policy.getMaturityDate().toString());
	                    row.createCell(policyColumn++).setCellValue(policy.getPremiumType());
	                    row.createCell(policyColumn++).setCellValue(policy.getSumAssured());
	                    row.createCell(policyColumn++).setCellValue(policy.getPremiumAmount());
	                    row.createCell(policyColumn++).setCellValue(policy.getPolicyStatus());
	                    
	                    InsuranceScheme scheme = policy.getInsuranceScheme();
	                    row.createCell(policyColumn++).setCellValue(scheme != null ? scheme.getSchemeName() : "");

	                    Agent agent = policy.getAgent();
	                    row.createCell(policyColumn++).setCellValue(agent != null ? agent.getUser().getFirstName() : "No Agent");
	                    row.createCell(policyColumn++).setCellValue(agent != null ? agent.getUser().getMobileNumber() : "No Agent");

	                    for (Nominee nominee : policy.getNominees()) {
	                        row.createCell(policyColumn++).setCellValue(nominee.getId());
	                        row.createCell(policyColumn++).setCellValue(nominee.getNomineeName());
	                        row.createCell(policyColumn++).setCellValue(nominee.getRelationStatus());
	                    }
	                }
	            }

	            workbook.write(baos);
	            return new ByteArrayResource(baos.toByteArray());
	        }
	    }
	}