package com.sofkianos.consumer;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Configuration pattern: declares queue, topic exchange, and binding for Kudos (kudos.queue / kudos.exchange / kudos.key). */
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
}
