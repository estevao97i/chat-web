package com.chat.controller;

import com.chat.enums.ActivityType;
import com.chat.model.Activity;
import com.chat.model.Content;
import com.chat.service.AzureBlobStorageService;
import lombok.RequiredArgsConstructor;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@RestController
@Controller
@RequiredArgsConstructor
public class AzureController {

    private final AzureBlobStorageService azureBlobStorageService;

    private final SimpMessagingTemplate simpMessagingTemplate;

    private static final Content CONTENT = new Content();

    @PostMapping("/upload")
    public Content singleFileUpload(@RequestParam("img") MultipartFile file) throws IOException {
        try {
            String blobUrl = azureBlobStorageService.uploadFile(file);
            CONTENT.getActivity().add(new Activity(blobUrl, ActivityType.SHARE));

            simpMessagingTemplate.convertAndSend("/topic/content", CONTENT);

            return CONTENT;
//            return new ResponseEntity<>("File uploaded successfully: " + blobUrl, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return CONTENT;
//            return new ResponseEntity<>("Failed to upload file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
