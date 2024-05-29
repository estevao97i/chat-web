package com.chat.controller;

import com.chat.enums.ActivityType;
import com.chat.model.Activity;
import com.chat.model.Chat;
import com.chat.model.Content;
import com.chat.model.User;
import com.chat.service.ConsumerMessageService;
import com.chat.service.ProducerMessageService;
import lombok.RequiredArgsConstructor;

import org.springframework.boot.autoconfigure.web.WebProperties;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import javax.swing.text.AbstractDocument;

@Controller
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:4200/")
public class WebSocketController {

    private static final Content CONTENT = new Content();

    private final ProducerMessageService serviceProducer;
    private final ConsumerMessageService serviceConsumer;

    @MessageMapping("/join")
    @SendTo("/topic/response")
    public Content joinUser(@Payload User user, SimpMessageHeaderAccessor headerAccessor) {
        CONTENT.getUsers().add(user);
        CONTENT.getActivity().add(new Activity(user, ActivityType.JOIN));
        headerAccessor.getSessionAttributes().put("user", user);

        System.out.println(CONTENT);
        return CONTENT;
    }

    @MessageMapping("/send")
    @SendTo("/topic/response")
    public void sendMessage(@Payload Chat message) {
        serviceProducer.sendMessage(message);
    }

//    @GetMapping("/")
//    public String handleRoot() {
//        return "index";  // Pode retornar qualquer string ou void
//    }
}
