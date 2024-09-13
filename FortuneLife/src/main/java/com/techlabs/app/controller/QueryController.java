package com.techlabs.app.controller;

import com.techlabs.app.dto.QueryDto;
import com.techlabs.app.service.QueryService;
import com.techlabs.app.util.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fortuneLife/query")
public class QueryController {
    private static final Logger logger = LoggerFactory.getLogger(QueryController.class);

    @Autowired
    private QueryService queryService;

    @Operation(summary = "Get All Queries")
    @GetMapping
    public ResponseEntity<PageResponse<QueryDto>> getAllQueries(
            @RequestParam(name = "id", required = false) Long id,
            @RequestParam(name = "title", required = false) String title,
            @RequestParam(name = "question", required = false) String question,
            @RequestParam(name = "answer", required = false) String answer,
            @RequestParam(name = "active", required = false) Boolean active,
            @RequestParam(name = "queryResponse", required = false) String queryResponse,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        logger.info("Fetching queries");
        PageResponse<QueryDto> queries = queryService.getAllQueries(id, title, question, answer, active, queryResponse,
                page, size);

        return new ResponseEntity<>(queries, HttpStatus.OK);
    }

    @Operation(summary = "Create new Query")
    @PostMapping
    public ResponseEntity<QueryDto> addNewQuery(@Valid @RequestBody QueryDto queryDto) {
        logger.info("Creating new Query");
        QueryDto newQuery = queryService.addNewQuery(queryDto);

        return new ResponseEntity<>(newQuery, HttpStatus.OK);
    }

        @Secured({"ADMIN","EMPLOYEE"})
    @Operation(summary = "Answer Query")
    @PutMapping("/answer")
    public ResponseEntity<QueryDto> answerQuery(@Valid @RequestBody QueryDto queryDto) {
        logger.info("Answering query");
        QueryDto answeredQuery = queryService.answerQuery(queryDto);

        return new ResponseEntity<>(answeredQuery, HttpStatus.OK);
    }

    @Operation(summary = "Edit query")
    @PutMapping("/edit")
    public ResponseEntity<QueryDto> editQuery(@Valid @RequestBody QueryDto queryDto) {
        logger.info("Editing query");
        QueryDto editedQuery = queryService.editQuery(queryDto);

        return new ResponseEntity<>(editedQuery, HttpStatus.OK);
    }

    @Operation(summary = "Delete query")
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteQuery(@PathVariable(name = "id") Long id) {
        logger.info("Deleting query");
        String message = queryService.deleteQuery(id);

        return ResponseEntity.ok(message);
    }

    @Operation(summary = "Activate Query")
    @PutMapping("/activate/{id}")
    public ResponseEntity<Object> activateQuery(@PathVariable(name = "id") Long id) {
        logger.info("Activating query");
        String message = queryService.activateQuery(id);

        return ResponseEntity.ok(message);
    }

    @Operation(summary = "Get all queries by customer mail ID")
    @GetMapping("/{customerEmail}")
    public ResponseEntity<PageResponse<QueryDto>> getAllQueriesOfParticularCustomer(
            @PathVariable(name = "customerEmail") String customerEmail,
            @RequestParam(name = "id", required = false) Long id,
            @RequestParam(name = "title", required = false) String title,
            @RequestParam(name = "question", required = false) String question,
            @RequestParam(name = "answer", required = false) String answer,
            @RequestParam(name = "active", required = false) Boolean active,
            @RequestParam(name = "queryResponse", required = false) String queryResponse,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        logger.info("Fetching all queries of customer with email: {}", customerEmail);
        PageResponse<QueryDto> queries = queryService.getAllQueriesByCustomerMail(
                customerEmail, id, title, question, answer, active, queryResponse, page, size
        );

        return new ResponseEntity<>(queries, HttpStatus.OK);
    }


}
