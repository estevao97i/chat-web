package com.chat.controller;

import com.chat.enums.ActivityType;
import com.chat.model.*;
import com.chat.service.AzureBlobStorageService;
import com.chat.service.ConsumerMessageService;
import com.chat.service.ProducerMessageService;
import lombok.RequiredArgsConstructor;

import org.springframework.boot.autoconfigure.web.WebProperties;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import javax.swing.text.AbstractDocument;
import java.awt.*;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.Iterator;
import java.util.Map;
import java.util.zip.GZIPInputStream;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    private final SimpMessageSendingOperations simpMessageSendingOperations;

    private static final Content CONTENT = new Content();

    private final ProducerMessageService serviceProducer;
    private final ConsumerMessageService serviceConsumer;

    @MessageMapping("/join")
    @SendTo("/topic/response")
    public Content joinUser(@Payload User user, SimpMessageHeaderAccessor headerAccessor) {
        CONTENT.getUsers().add(user);
        CONTENT.getActivity().add(new Activity(user, ActivityType.JOIN));
        headerAccessor.getSessionAttributes().put("user", user);

        return CONTENT;
    }

    @MessageMapping("/send")
    public Content sendMessage(@Payload Chat message) {
        CONTENT.getActivity().add(new Activity(message.getUser(), ActivityType.CHAT, message.getContent()));
        simpMessagingTemplate.convertAndSend("/topic/response", CONTENT);

        return CONTENT;
//        serviceProducer.sendMessage(message);

    }

    @MessageMapping("/img")
    public Content sendImg(@Payload byte[] compressedImg) {
        System.out.println(Arrays.toString(compressedImg));
        System.out.println("chegou aqui");

        simpMessagingTemplate.convertAndSend("/topic/content", compressedImg);

        return CONTENT;
    }


    @MessageMapping("/remove")
//    @SendTo("/topic/response")
    public Content removeUser(@Payload User user) {
        CONTENT.getUsers().remove(user);
        CONTENT.getActivity().add(new Activity(user, ActivityType.LEAVE));
        simpMessagingTemplate.convertAndSend("/topic/leave", CONTENT);

        return CONTENT;
    }

    @EventListener
    public void socketDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor wrap = StompHeaderAccessor.wrap(event.getMessage());

        if (wrap.getSessionAttributes().containsKey("user")) {
            User user = (User) wrap.getSessionAttributes().get("user");
            Iterator<User> userIterator = CONTENT.getUsers().iterator();
            while (userIterator.hasNext()) {
                User currentUser = userIterator.next();
                if (currentUser.getName().equals(user.getName())) {
                    userIterator.remove();
                }
            }
            CONTENT.getActivity().add(new Activity(user, ActivityType.LEAVE));
        }
        simpMessageSendingOperations.convertAndSend("/topic/response", CONTENT);
    }

}
