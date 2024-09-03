package com.techlabs.app.service;

import java.io.IOException;

import org.springframework.core.io.ByteArrayResource;

public interface ExcelReportService {

	ByteArrayResource createExcelFile() throws IOException;


}
