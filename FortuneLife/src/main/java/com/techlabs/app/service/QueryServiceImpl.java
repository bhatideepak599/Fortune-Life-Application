package com.techlabs.app.service;

import com.techlabs.app.config.EmailSender;
import com.techlabs.app.dto.EmailDTO;
import com.techlabs.app.dto.QueryDto;
import com.techlabs.app.entity.Query;
import com.techlabs.app.enums.ResponseStatus;
import com.techlabs.app.exception.FortuneLifeException;
import com.techlabs.app.mapper.QueryMapper;
import com.techlabs.app.repository.QueryRepository;
import com.techlabs.app.util.PageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QueryServiceImpl implements QueryService {
    @Autowired
    private QueryRepository queryRepository;

    @Autowired
    private QueryMapper queryMapper;

    @Autowired
    private EmailSender emailSender;


    @Override
    public PageResponse<QueryDto> getAllQueries(Long id, String title, String question, String answer, Boolean active, String queryResponse, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Query> queryPage = queryRepository.findByCriteria(id, title, question, answer, active, queryResponse, pageable);

        List<QueryDto> queryDtoList = queryMapper.getDtoList(queryPage.getContent());
        return new PageResponse<>(
                queryDtoList,
                queryPage.getNumber(),
                queryPage.getNumberOfElements(),
                queryPage.getTotalElements(),
                queryPage.getTotalPages(),
                queryPage.isLast()
        );
    }

    @Override
    public QueryDto addNewQuery(QueryDto queryDto) {
        Query query = queryMapper.dtoToEntity(queryDto);
        query.setQueryResponse(ResponseStatus.PENDING.name());
        Query savedQuery = queryRepository.save(query);

        return queryMapper.entityToDto(savedQuery);
    }

    @Override
    public QueryDto answerQuery(QueryDto queryDto) {
        Query query = queryRepository.findById(queryDto.getId()).orElseThrow(() -> new FortuneLifeException("Query " +
                "with ID : " + queryDto.getId() + " cannot be found"));

        if (!query.getActive()) {
            throw new FortuneLifeException("Query is not active");
        }

        query.setAnswer(queryDto.getAnswer());
        if (!query.getAnswer().isEmpty()) {
            query.setQueryResponse(ResponseStatus.SOLVED.name());
        } else {
            query.setQueryResponse(ResponseStatus.PENDING.name());
        }
        Query updatedQuery = queryRepository.save(query);

        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setTo(queryDto.getEmail());
        emailDTO.setSubject("RE : "+queryDto.getTitle());
        emailDTO.setBody(queryDto.getQueryResponse());
        emailSender.sendMailWithAttachement(emailDTO);

        return queryMapper.entityToDto(updatedQuery);
    }

    @Override
    public QueryDto editQuery(QueryDto queryDto) {
        Query query = queryRepository.findById(queryDto.getId()).orElseThrow(() -> new FortuneLifeException("Query " +
                "with ID : " + queryDto.getId() + " cannot be found"));

        if (!query.getActive()) {
            throw new FortuneLifeException("Query is not active");
        }

        Query answeredQuery = queryMapper.dtoToEntity(queryDto);
        if (answeredQuery.getAnswer().isEmpty()) {
            answeredQuery.setQueryResponse(ResponseStatus.PENDING.name());
        }
        Query updatedQuery = queryRepository.save(answeredQuery);

        return queryMapper.entityToDto(updatedQuery);
    }

    @Override
    public String deleteQuery(Long id) {
        Query query = queryRepository.findById(id).orElseThrow(() -> new FortuneLifeException("Query " +
                "with ID : " + id + " cannot be found"));

        if (!query.getActive()) {
            throw new FortuneLifeException("Query is not active");
        }

        query.setActive(false);
        queryRepository.save(query);

        return "Query with ID : " + id + " is deleted successfully";
    }

    @Override
    public String activateQuery(Long id) {
        Query query = queryRepository.findById(id).orElseThrow(() -> new FortuneLifeException("Query " +
                "with ID : " + id + " cannot be found"));

        if (query.getActive()) {
            throw new FortuneLifeException("Query is already active");
        }

        query.setActive(true);
        queryRepository.save(query);

        return "Query with ID : " + id + " is activated successfully";
    }

    @Override
    public PageResponse<QueryDto> getAllQueriesByCustomerMail(
            String customerEmail,
            Long id,
            String title,
            String question,
            String answer,
            Boolean active,
            String queryResponse,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Query> queryPage = queryRepository.findByCustomerEmailAndCriteria(
                customerEmail, id, title, question, answer, active, queryResponse, pageable
        );

        List<QueryDto> queryDtoList = queryMapper.getDtoList(queryPage.getContent());
        return new PageResponse<>(
                queryDtoList,
                queryPage.getNumber(),
                queryPage.getNumberOfElements(),
                queryPage.getTotalElements(),
                queryPage.getTotalPages(),
                queryPage.isLast()
        );
    }


}
