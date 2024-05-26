package com.chat.service;

import com.chat.model.Chat;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConsumerMessageService {

    private static final String TOPIC = "ws-messages";

    private final SimpMessagingTemplate messagingTemplate;

    private final List<Chat> messages = new ArrayList<>();

    @KafkaListener(topics = TOPIC, groupId = "ws-group")
    public void listen(Chat message) {
        log.info("Mensagem recebida pelo kafka: {}", message);
        messages.add(message);
        messagingTemplate.convertAndSendToUser("user_teste", "/topic/messages", message);
    }

    public List<Chat> getChatMessages() {
        // Implementasikan logika untuk mengembalikan daftar pesan dari Kafka
        return new ArrayList<>(messages);
    }
}
