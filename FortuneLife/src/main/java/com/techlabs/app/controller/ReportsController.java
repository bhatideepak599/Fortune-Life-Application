package com.techlabs.app.controller;import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.techlabs.app.service.ExcelReportService;
import com.techlabs.app.service.PdfReportService;

import io.swagger.v3.oas.annotations.Operation;

import java.io.IOException;

@RestController
@RequestMapping("/fortuneLife/reports")
public class ReportsController {

    private final ExcelReportService excelReportService;
    private final PdfReportService pdfReportService;

    public ReportsController(ExcelReportService excelReportService, PdfReportService pdfReportService) {
		super();
		this.excelReportService = excelReportService;
		this.pdfReportService = pdfReportService;
	}
    @Operation(summary = "Download Customer Report in Excel Sheet")
	@GetMapping("/customer/excel-report/download")
    public ResponseEntity<ByteArrayResource> downloadExcelFileForCustomer() {
        try {
            ByteArrayResource file = excelReportService.downloadExcelFileForCustomer();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=customers.xlsx")
                    .contentLength(file.contentLength())
                    .contentType(org.springframework.http.MediaType.APPLICATION_OCTET_STREAM)
                    .body(file);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @Operation(summary = "Download Customer Report in pdf")
	@GetMapping("/customer/pdf-report/download")
	public ResponseEntity<byte[]> downloadPdfFileForCustomer() throws IOException {
		// Fetch customer data
		byte[] pdfBytes = pdfReportService.downloadPdfFileForCustomer();

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_PDF);
		headers.setContentDispositionFormData("attachment", "CustomerReport.pdf");

		return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
	}
	@Operation(summary = "Download Agent Report in Excel Sheet")
	@GetMapping("/agent/excel-report/download")
    public ResponseEntity<ByteArrayResource> downloadExcelFileForAgent() {
        try {
            ByteArrayResource file = excelReportService.downloadExcelFileForAgent();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Agent.xlsx")
                    .contentLength(file.contentLength())
                    .contentType(org.springframework.http.MediaType.APPLICATION_OCTET_STREAM)
                    .body(file);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @Operation(summary = "Download Agent Report in pdf")
	@GetMapping("/agent/pdf-report/download")
	public ResponseEntity<byte[]> downloadPdfFileForAgent() throws IOException {
		// Fetch customer data
		byte[] pdfBytes = pdfReportService.downloadPdfFileForAgent();

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_PDF);
		headers.setContentDispositionFormData("attachment", "AgentReport.pdf");

		return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
	}
}
