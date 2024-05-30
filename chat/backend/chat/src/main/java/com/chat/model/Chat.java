package com.chat.model;

import com.chat.enums.MessageType;
import lombok.*;

import java.awt.*;
import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Chat implements Serializable {

    private String sender;
    private String content;

}
