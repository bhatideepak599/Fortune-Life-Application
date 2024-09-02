package com.techlabs.app.controller;

import com.techlabs.app.entity.FileItem;
import com.techlabs.app.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

@RestController
@RequestMapping("/fortuneLife/file")
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping(value = {"/upload"}, consumes = {"multipart/form-data"})
    public ResponseEntity<FileItem> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        FileItem fileItem = fileService.saveFileAndReturnItem(file);
        return new ResponseEntity<>(fileItem, HttpStatus.CREATED);
    }

    @GetMapping("/view/{name}")
    public ResponseEntity<byte[]> viewFileByName(@PathVariable String name) throws IOException {
        FileItem fileItem = fileService.getFileByUUIDName(name);
        if (fileItem != null) {
            File file = new File(fileItem.getLocation());
            byte[] content = Files.readAllBytes(file.toPath());

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(fileItem.getType()))
                    .body(content);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
