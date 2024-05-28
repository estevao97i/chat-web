package com.chat.controller;

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

    private static final Content content = new Content();

    private final ProducerMessageService serviceProducer;
    private final ConsumerMessageService serviceConsumer;

    @MessageMapping("/join")
    @SendTo("/topic/messages")
    public Content joinUser(@Payload User user, SimpMessageHeaderAccessor headerAccessor) {
//        System.out.println(user.getName());


    }

    @MessageMapping("/send")
    @SendTo("/topic/messages")
    public void sendMessage(@Payload Chat message) {
        serviceProducer.sendMessage(message);
    }

//    @GetMapping("/")
//    public String handleRoot() {
//        return "index";  // Pode retornar qualquer string ou void
//    }
}
