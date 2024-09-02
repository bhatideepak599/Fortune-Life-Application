package com.techlabs.app.service;

import com.techlabs.app.entity.FileItem;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {

    FileItem saveFileAndReturnItem(MultipartFile file) throws IOException;

    FileItem getFileByUUIDName(String name);
}
