package com.sofkianos.consumer.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * RabbitMQ topology and messaging configuration for the Consumer Worker.
 * <p>
 * Declares queue, topic exchange, binding, and a
 * {@link Jackson2JsonMessageConverter} so that incoming JSON messages
 * are automatically deserialized into typed DTOs (e.g., {@code KudoEvent}).
 * </p>
 */
@Configuration
public class RabbitConfig {

    public static final String QUEUE_NAME = "kudos.queue";
    public static final String EXCHANGE_NAME = "kudos.exchange";
    public static final String ROUTING_KEY = "kudos.key";

    @Bean
    public Queue kudosQueue() {
        return new Queue(QUEUE_NAME, true);
    }

    @Bean
    public TopicExchange kudosExchange() {
        return new TopicExchange(EXCHANGE_NAME, true, false);
    }

    @Bean
    public Binding kudosBinding(Queue kudosQueue, TopicExchange kudosExchange) {
        return BindingBuilder.bind(kudosQueue).to(kudosExchange).with(ROUTING_KEY);
    }

    /**
     * Registers a Jackson-based {@link MessageConverter} so Spring AMQP
     * deserializes JSON payloads into POJOs automatically.
     * <p>
     * This eliminates the need for manual {@code ObjectMapper.readTree()}
     * parsing in service or consumer classes.
     * </p>
     */
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
