package com.chat.model;

import com.chat.enums.ActivityType;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
public class Activity implements Serializable {

    private User user;
    private ActivityType type;
    private String message;
    private String img;

    public Activity(User userComing, ActivityType activityType) {
        this.user = userComing;
        this.type = activityType;
    }

    public Activity(User userComing, ActivityType activityType, String messageComing) {
        this.user = userComing;
        this.type = activityType;
        this.message = messageComing;
    }

    public Activity(String img, ActivityType type) {
        this.img = img;
        this.type = type;
    }
}
