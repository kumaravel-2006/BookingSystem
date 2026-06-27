package com.ticketing.queue_service.websocket;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ticketing.queue_service.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
@RequiredArgsConstructor
@Slf4j
public class QueueWebSocketHandler extends TextWebSocketHandler {

    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Track active sessions and their topic subscriptions
    private final Map<String, Set<WebSocketSession>> topicSubscriptions = new ConcurrentHashMap<>();
    private final Map<WebSocketSession, Set<String>> sessionTopics = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("WebSocket connection attempt from session: {}", session.getId());

        String query = session.getUri() != null ? session.getUri().getQuery() : null;
        String token = null;

        if (query != null && query.contains("token=")) {
            token = query.split("token=")[1].split("&")[0];
        }

        if (token == null || !jwtUtil.validateToken(token)) {
            log.warn("Invalid or missing WebSocket JWT token. Closing session.");
            session.close(CloseStatus.BAD_DATA);
            return;
        }

        log.info("WebSocket session authenticated successfully: {}", session.getId());
        sessionTopics.put(session, new CopyOnWriteArraySet<>());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        log.info("Received WebSocket message: {} from session: {}", payload, session.getId());

        try {
            JsonNode rootNode = objectMapper.readTree(payload);
            String type = rootNode.path("type").asText();
            String topic = rootNode.path("topic").asText();

            if ("SUBSCRIBE".equalsIgnoreCase(type) && !topic.isEmpty()) {
                log.info("Session {} subscribing to topic: {}", session.getId(), topic);
                subscribe(session, topic);
            } else if ("UNSUBSCRIBE".equalsIgnoreCase(type) && !topic.isEmpty()) {
                log.info("Session {} unsubscribing from topic: {}", session.getId(), topic);
                unsubscribe(session, topic);
            }
        } catch (Exception e) {
            log.error("Error processing text message", e);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info("WebSocket connection closed: {} with status: {}", session.getId(), status);
        Set<String> topics = sessionTopics.remove(session);
        if (topics != null) {
            for (String topic : topics) {
                Set<WebSocketSession> sessions = topicSubscriptions.get(topic);
                if (sessions != null) {
                    sessions.remove(session);
                    if (sessions.isEmpty()) {
                        topicSubscriptions.remove(topic);
                    }
                }
            }
        }
    }

    private void subscribe(WebSocketSession session, String topic) {
        topicSubscriptions.computeIfAbsent(topic, k -> new CopyOnWriteArraySet<>()).add(session);
        Set<String> topics = sessionTopics.get(session);
        if (topics != null) {
            topics.add(topic);
        }
    }

    private void unsubscribe(WebSocketSession session, String topic) {
        Set<WebSocketSession> sessions = topicSubscriptions.get(topic);
        if (sessions != null) {
            sessions.remove(session);
            if (sessions.isEmpty()) {
                topicSubscriptions.remove(topic);
            }
        }
        Set<String> topics = sessionTopics.get(session);
        if (topics != null) {
            topics.remove(topic);
        }
    }

    /**
     * Broadcasts a JSON message wrapper to all users subscribed to the topic.
     */
    public void sendNotification(String topic, Object payload) {
        Set<WebSocketSession> sessions = topicSubscriptions.get(topic);
        if (sessions == null || sessions.isEmpty()) {
            log.debug("No active WebSocket subscriptions for topic: {}", topic);
            return;
        }

        try {
            Map<String, Object> wrapper = new HashMap<>();
            wrapper.put("topic", topic);
            wrapper.put("payload", payload);

            String json = objectMapper.writeValueAsString(wrapper);
            TextMessage textMessage = new TextMessage(json);

            log.info("Broadcasting update to topic: {} -> {}", topic, json);
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    try {
                        session.sendMessage(textMessage);
                    } catch (IOException e) {
                        log.error("Failed sending WebSocket message to session: {}", session.getId(), e);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Serialization failed for WebSocket payload on topic: {}", topic, e);
        }
    }
}
