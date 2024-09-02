package com.techlabs.app.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class APIException extends RuntimeException{
    private static final long serialVersionUID = 1L;
    private HttpStatus status;
    private String message;

    public APIException(String message, HttpStatus status, String tempMessage) {
        super(message);
        this.status = status;
        this.message = tempMessage;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
