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
import org.springframework.context.event.EventListener;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import javax.swing.text.AbstractDocument;
import java.util.Iterator;

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
