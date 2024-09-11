package com.techlabs.app.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;

import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.VerticalAlignment;
import com.techlabs.app.entity.Address;
import com.techlabs.app.entity.Agent;
import com.techlabs.app.entity.Commission;
import com.techlabs.app.entity.Customer;
import com.techlabs.app.entity.InsurancePolicy;
import com.techlabs.app.entity.User;
import com.techlabs.app.exception.AgentRelatedException;
import com.techlabs.app.exception.CustomerRelatedException;
import com.techlabs.app.repository.AgentRepository;
import com.techlabs.app.repository.CustomerRepository;

@Service
public class PdfReportServiceImpl implements PdfReportService {
	private final CustomerRepository customerRepository;
	private final AgentRepository agentRepository;
	
	public PdfReportServiceImpl(CustomerRepository customerRepository, AgentRepository agentRepository) {
		super();
		this.customerRepository = customerRepository;
		this.agentRepository = agentRepository;
	}

	@Override
	public byte[] downloadPdfFileForCustomer() throws IOException {
		List<Customer> customers = customerRepository.findAll();
		if (customers == null) {
			throw new CustomerRelatedException("No Customers Available");
		}

		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		PdfWriter writer = new PdfWriter(baos);
		PdfDocument pdfDoc = new PdfDocument(writer);
		Document document = new Document(pdfDoc);

		// Load the font
		PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);

		// Add title
		document.add(new Paragraph("Customer Report").setBold().setFontSize(18).setFont(font));

		// Create a table with 2 columns
		Table table = new Table(2);

		// Add headers
		table.addCell(new Cell().add(new Paragraph("Customer Details").setFont(font))
				.setBackgroundColor(new DeviceRgb(220, 220, 220)));
		table.addCell(new Cell().add(new Paragraph("Policies and Agent").setFont(font))
				.setBackgroundColor(new DeviceRgb(220, 220, 220)));

		// Add customer data to the table
		for (Customer customer : customers) {
			// Customer ID, Active Status, Verified Status
			StringBuilder customerDetails = new StringBuilder();
			customerDetails.append("Customer ID: ").append(customer.getId()).append("\n").append("Active: ")
					.append(customer.getActive()).append("\n");

			// User and Address Details
			User user = customer.getUser();
			if(user.getAddress()==null) {
				Address address=new Address();
				address.setApartment("N/A");
				address.setCity("N/A");
				address.setHouseNumber("N/A");
				address.setState("N/A");
				user.setAddress(address);
				
			}
			Address address = user.getAddress();
			
			StringBuilder userDetails = new StringBuilder();
			userDetails.append("Username: ").append(user.getUsername()).append("\n").append("First Name: ")
					.append(user.getFirstName()).append("\n").append("Last Name: ").append(user.getLastName())
					.append("\n").append("Email: ").append(user.getEmail()).append("\n").append("Gender: ")
					.append(user.getGender()).append("\n").append("Mobile Number: ").append(user.getMobileNumber())
					.append("\n");

			StringBuilder addressDetails = new StringBuilder();
			if(address.getHouseNumber()==null) address.setHouseNumber("N/A");
			addressDetails.append("Address: ").append(address.getHouseNumber()).append(", ")
					.append(address.getApartment()).append(", ").append(address.getCity()).append(", ")
					.append(address.getState()).append(", ").append(address.getPinCode()).append("\n");

			// Combine user and address details
			StringBuilder userAndAddressDetails = new StringBuilder();
			userAndAddressDetails.append(userDetails.toString()).append(addressDetails.toString());

			// Add customer details to the first column
			table.addCell(
					new Cell().add(new Paragraph(customerDetails.toString() + "\n\n" + userAndAddressDetails.toString())
							.setFont(font).setVerticalAlignment(VerticalAlignment.TOP)));

			StringBuilder policyDetails = new StringBuilder();
			for (InsurancePolicy policy : customer.getPolicies()) {
				policyDetails.append("Policy ID: ").append(policy.getId()).append("\n").append("Scheme: ")
						.append(policy.getInsuranceScheme().getSchemeName()).append("\n").append("Premium Type: ")
						.append(policy.getPremiumType()).append("\n").append("Sum Assured: ")
						.append(policy.getSumAssured()).append("\n").append("Premium Amount: ")
						.append(policy.getPremiumAmount()).append("\n").append("Status: ")
						.append(policy.getPolicyStatus()).append("\n").append("Agent ID: ")
						.append(policy.getAgent() != null ? policy.getAgent().getId() : "N/A").append("\n")
						.append("Agent Name: ")
						.append(policy.getAgent() != null ? policy.getAgent().getUser().getFirstName() + " "
								+ policy.getAgent().getUser().getLastName() : "N/A")
						.append("\n").append("Agent Mobile: ")
						.append(policy.getAgent() != null ? policy.getAgent().getUser().getMobileNumber() : "N/A")
						.append("\n\n");
			}

			table.addCell(new Cell().add(
					new Paragraph(policyDetails.toString()).setFont(font).setVerticalAlignment(VerticalAlignment.TOP)));
		}

		document.add(table);
		document.close();

		return baos.toByteArray();
	}

	@Override
	public byte[] downloadPdfFileForAgent() throws IOException {
		List<Agent> agents = agentRepository.findAll();
		if (agents == null) {
			throw new AgentRelatedException("No Agent Available");
		}
		
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		PdfWriter writer = new PdfWriter(baos);
		PdfDocument pdfDoc = new PdfDocument(writer);
		Document document = new Document(pdfDoc);

		// Load the font
		PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);

		// Add title
		document.add(new Paragraph("Customer Report").setBold().setFontSize(18).setFont(font));

		// Create a table with 2 columns
		Table table = new Table(2);

		// Add headers
		table.addCell(new Cell().add(new Paragraph("Agent Details").setFont(font))
				.setBackgroundColor(new DeviceRgb(220, 220, 220)));
		table.addCell(new Cell().add(new Paragraph("Commission Details").setFont(font))
				.setBackgroundColor(new DeviceRgb(220, 220, 220)));

		// Add customer data to the table
		for (Agent agent : agents) {
			// Customer ID, Active Status, Verified Status
			StringBuilder agentDetails = new StringBuilder();
			agentDetails.append("Agent ID: ").append(agent.getId()).append("\n").append("Status : ")
					.append(agent.getActive()?"Active":"InActive").append("\n").append("Verification: ")
					.append(agent.getVerified()?"Approved":"Pending")
					
					.append("\n");

			// User and Address Details
			User user = agent.getUser();
			if(user.getAddress()==null) {
				Address address=new Address();
				address.setApartment("N/A");
				address.setCity("N/A");
				address.setHouseNumber("N/A");
				address.setState("N/A");
				user.setAddress(address);
				
			}
			Address address = user.getAddress();
			
			StringBuilder userDetails = new StringBuilder();
			userDetails.append(("Username: ")).append(user.getUsername()).append("\n").append("First Name: ")
					.append(user.getFirstName()).append("\n").append("Last Name: ").append(user.getLastName())
					.append("\n").append("Email: ").append(user.getEmail()).append("\n").append("Gender: ")
					.append(user.getGender()).append("\n").append("Mobile Number: ").append(user.getMobileNumber())
					.append("\n");

			StringBuilder addressDetails = new StringBuilder();
			addressDetails.append("Address: ").append(address.getHouseNumber()).append(", ")
					.append(address.getApartment()).append(", ").append(address.getCity()).append(", ")
					.append(address.getState()).append(", ").append(address.getPinCode()).append("\n");

			// Combine user and address details
			StringBuilder userAndAddressDetails = new StringBuilder();
			userAndAddressDetails.append(userDetails.toString()).append(addressDetails.toString());

			// Add customer details to the first column
			table.addCell(
					new Cell().add(new Paragraph(agentDetails.toString() + "\n\n" + userAndAddressDetails.toString())
							.setFont(font).setVerticalAlignment(VerticalAlignment.TOP)));

			StringBuilder commissionDetails = new StringBuilder();
			for (Commission commision : agent.getCommissions()) {
				commissionDetails.append("Commision ID: ").append(commision.getId()).append("\n").append("Commision Type: ")
						.append(commision.getCommissionType()).append("\n").append("Date : ")
						.append(commision.getIssueDate().toString()).append("\n").append("Amount : ")
						.append(commision.getAmount()).append("\n")
						.append("\n\n");
			}

			table.addCell(new Cell().add(
					new Paragraph(commissionDetails.toString()).setFont(font).setVerticalAlignment(VerticalAlignment.TOP)));
		}

		document.add(table);
		document.close();

		return baos.toByteArray();
	}

}
