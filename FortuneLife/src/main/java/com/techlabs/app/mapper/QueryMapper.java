package com.techlabs.app.mapper;

import com.techlabs.app.dto.QueryDto;
import com.techlabs.app.entity.Query;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class QueryMapper {
    public Query dtoToEntity(QueryDto queryDto) {
        Query query = new Query();
        query.setEmail(queryDto.getEmail());
        query.setActive(queryDto.getActive());
        query.setQueryResponse(queryDto.getQueryResponse());
        query.setAnswer(queryDto.getAnswer());
        query.setTitle(queryDto.getTitle());
        query.setQuestion(queryDto.getQuestion());

        return query;
    }

    public QueryDto entityToDto(Query query) {
        QueryDto queryDto = new QueryDto();
        queryDto.setId(query.getId());
        queryDto.setActive(query.getActive());
        queryDto.setQuestion(query.getQuestion());
        queryDto.setQueryResponse(query.getQueryResponse());
        queryDto.setEmail(query.getEmail());
        queryDto.setTitle(query.getTitle());
        queryDto.setAnswer(query.getAnswer());

        return queryDto;
    }

    public List<Query> getEntityList(List<QueryDto> queryDtoList) {
        List<Query> queries = new ArrayList<>();
        for (QueryDto queryDto : queryDtoList) {
            queries.add(dtoToEntity(queryDto));
        }

        return queries;
    }

    public List<QueryDto> getDtoList(List<Query> queries) {
        List<QueryDto> queryDtoList = new ArrayList<>();
        for (Query query : queries) {
            queryDtoList.add(entityToDto(query));
        }

        return queryDtoList;
    }
}
