package com.driver.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class GpsWebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Prefix for topics parents/admins subscribe to (e.g. /topic/location/d1)
        config.enableSimpleBroker("/topic");
        
        // Prefix for messages sent from driver app to backend (e.g. /app/location)
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // SockJS STOMP endpoint
        registry.addEndpoint("/ws-gps")
                .setAllowedOriginPatterns("*")
                .withSockJS();
                
        // Plain WebSockets endpoint
        registry.addEndpoint("/ws-gps-raw")
                .setAllowedOriginPatterns("*");
    }
}
