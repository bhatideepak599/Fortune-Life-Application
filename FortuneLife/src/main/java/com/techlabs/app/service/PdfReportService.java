package com.techlabs.app.service;

import java.io.IOException;

public interface PdfReportService {
	byte[] generateCustomerPdf() throws IOException ;
}
