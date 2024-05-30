package com.chat.model;

import com.chat.enums.ActivityType;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Activity implements Serializable {

    private User user;
    private ActivityType type;
}
