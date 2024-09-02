package com.techlabs.app.util;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PageResponse<T> {
	private List<T> content;
	private int page;
	private int size;
	private long totalElements;
	private int totalPages;
	private boolean last;

}