package com.techlabs.app.exception;

public class ResourceNotFoundException extends RuntimeException {
	public ResourceNotFoundException(String message) {
        super(message);
    }
}
