package com.techlabs.app.service;

import com.techlabs.app.dto.QueryDto;
import com.techlabs.app.util.PageResponse;

import java.util.List;

public interface QueryService {
    PageResponse<QueryDto> getAllQueries(Long id, String title, String question, String answer, Boolean active, String queryResponse, int page, int size);

    QueryDto addNewQuery(QueryDto queryDto);

    QueryDto answerQuery(QueryDto queryDto);

    QueryDto editQuery(QueryDto queryDto);

    String deleteQuery(Long id);

    String activateQuery(Long id);

    PageResponse<QueryDto> getAllQueriesByCustomerMail(String customerEmail, Long id, String title, String question, String answer, Boolean active, String queryResponse, int page, int size);
}
