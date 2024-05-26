package com.chat.controller;

import com.chat.model.Chat;
import com.chat.model.User;
import com.chat.service.ConsumerMessageService;
import com.chat.service.ProducerMessageService;
import lombok.RequiredArgsConstructor;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:4200/")
public class WebSocketController {

    private final ProducerMessageService serviceProducer;
    private final ConsumerMessageService serviceConsumer;

    @MessageMapping("/join")
    @SendTo("/topic/messages")
    public void joinUser(@Payload User user, SimpMessageHeaderAccessor headerAccessor) {
        System.out.println(user.getName());
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
