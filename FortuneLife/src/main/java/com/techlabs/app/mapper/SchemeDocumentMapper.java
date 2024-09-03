package com.techlabs.app.mapper;

import com.techlabs.app.dto.SchemeDocumentDto;
import com.techlabs.app.entity.SchemeDocument;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class SchemeDocumentMapper {
    public SchemeDocument dtoToEntity(SchemeDocumentDto schemeDocumentDto) {
        SchemeDocument schemeDocument = new SchemeDocument();
        schemeDocument.setDocumentName(schemeDocumentDto.getDocumentName());

        return schemeDocument;
    }

    public SchemeDocumentDto entityToDto(SchemeDocument schemeDocument) {
        SchemeDocumentDto schemeDocumentDto = new SchemeDocumentDto();
        schemeDocumentDto.setId(schemeDocument.getId());
        schemeDocumentDto.setDocumentName(schemeDocument.getDocumentName());

        return schemeDocumentDto;
    }

    public Set<SchemeDocument> getEntityList(Set<SchemeDocumentDto> schemeDocumentDtoList) {
        Set<SchemeDocument> schemeDocuments = new HashSet<>();
        for (SchemeDocumentDto schemeDocumentDto : schemeDocumentDtoList) {
            schemeDocuments.add(dtoToEntity(schemeDocumentDto));
        }

        return schemeDocuments;
    }

    public Set<SchemeDocumentDto> getDtoList(Set<SchemeDocument> schemeDocuments) {
        Set<SchemeDocumentDto> schemeDocumentDtoList = new HashSet<>();
        for (SchemeDocument schemeDocument : schemeDocuments) {
            schemeDocumentDtoList.add(entityToDto(schemeDocument));
        }

        return schemeDocumentDtoList;
    }
}