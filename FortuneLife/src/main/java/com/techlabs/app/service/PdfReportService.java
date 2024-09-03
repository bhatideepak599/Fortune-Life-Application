package com.techlabs.app.service;

import java.io.IOException;

public interface PdfReportService {
	byte[] downloadPdfFileForCustomer() throws IOException ;

	byte[] downloadPdfFileForAgent() throws IOException;
}
