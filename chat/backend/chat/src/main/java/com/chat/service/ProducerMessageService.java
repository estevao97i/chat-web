package com.chat.service;

import com.chat.model.Chat;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.io.Serializable;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProducerMessageService {

    private static final String TOPIC = "ws-messages";
    private final KafkaTemplate<String, Serializable> kafkaTemplate;

    public void sendMessage(Chat message) {
        kafkaTemplate.send(TOPIC, message);
    }
}
