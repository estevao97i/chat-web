package com.chat.model;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Chat implements Serializable {

    private User user;
    private String content;

}
