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
@RequestMapping("/api/reports")
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
    public ResponseEntity<ByteArrayResource> downloadExcelFile() {
        try {
            ByteArrayResource file = excelReportService.createExcelFile();
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
	public ResponseEntity<byte[]> downloadCustomerReportPdf() throws IOException {
		// Fetch customer data
		byte[] pdfBytes = pdfReportService.generateCustomerPdf();

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_PDF);
		headers.setContentDispositionFormData("attachment", "CustomerReport.pdf");

		return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
	}
}
