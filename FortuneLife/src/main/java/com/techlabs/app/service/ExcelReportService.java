package com.techlabs.app.service;

import java.io.IOException;

import org.springframework.core.io.ByteArrayResource;

public interface ExcelReportService {

	ByteArrayResource downloadExcelFileForCustomer() throws IOException;

	ByteArrayResource downloadExcelFileForAgent() throws IOException;


}
