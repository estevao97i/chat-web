package com.chat.model;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Imagem implements Serializable {

    private String imgSrc;
}
