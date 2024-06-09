package com.chat.service;

import com.azure.storage.blob.*;
import com.azure.storage.blob.models.BlobHttpHeaders;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class AzureBlobStorageService {

    private final BlobContainerClient containerClient;

    @Autowired
    public AzureBlobStorageService(
            @Value("${azure.storage.account-name}") String accountName,
            @Value("${azure.storage.account-key}") String accountKey,
            @Value("${azure.storage.container-name}") String containerName) {

        String endpoint = String.format("https://%s.blob.core.windows.net", accountName);
        String connectionString = String.format("DefaultEndpointsProtocol=https;AccountName=%s;AccountKey=%s;EndpointSuffix=core.windows.net", accountName, accountKey);

        this.containerClient = new BlobContainerClientBuilder()
                .endpoint(endpoint)
                .connectionString(connectionString)
                .containerName(containerName)
                .buildClient();
    }

    public String uploadFile(MultipartFile file) throws IOException {
        BlobClient blobClient = containerClient.getBlobClient(file.getOriginalFilename());
        BlobHttpHeaders headers = new BlobHttpHeaders().setContentType(file.getContentType());
        blobClient.upload(file.getInputStream(), file.getSize(), true);
        blobClient.setHttpHeaders(headers);
        return blobClient.getBlobUrl();
    }


}
