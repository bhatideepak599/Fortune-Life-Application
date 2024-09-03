package com.techlabs.app.service;

import com.techlabs.app.entity.FileItem;
import com.techlabs.app.exception.FileRelatedException;
import com.techlabs.app.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

	@Value("${project.file}")
	private String path;

	@Autowired
	private FileRepository fileRepository;

	@Override
	public FileItem saveFileAndReturnItem(MultipartFile file) throws IOException {
		String name = storeFile(file);

		FileItem fileItem = FileItem.builder().name(name).type(file.getContentType())
				.location(path + File.separator + name).build();

		return fileRepository.save(fileItem);
	}

	private String storeFile(MultipartFile file) throws IOException {
		String name = UUID.randomUUID()
				+ file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
		String fullPath = path + File.separator + name;

		Files.copy(file.getInputStream(), Paths.get(fullPath));

		return name;
	}

	@Override
	public FileItem getFileByUUIDName(String name) {
		return fileRepository.findByName(name)
				.orElseThrow(() -> new FileRelatedException("File with UUID name: " + name + " not found"));
	}
}