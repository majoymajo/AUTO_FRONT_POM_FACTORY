package com.sofkianos.producer.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * RabbitMQ topology configuration for the Producer API.
 *
 * <p>Architecture principles:
 * <ul>
 *     <li>API Gateway Pattern: supports the inbound API by defining the outbound messaging contracts.</li>
 *     <li>Asynchronous Messaging: declares exchange, queue, and binding for non-blocking delivery.</li>
 *     <li>Separation of Concerns: isolates messaging infrastructure from web controllers.</li>
 * </ul>
 */
@Configuration
public class RabbitConfig {

    @Value("${app.rabbitmq.queue}")
    private String queueName;

    @Value("${app.rabbitmq.exchange}")
    private String exchangeName;

    @Value("${app.rabbitmq.routing-key}")
    private String routingKey;

    @Bean
    public Queue kudosQueue() {
        return new Queue(queueName, true);
    }

    @Bean
    public TopicExchange kudosExchange() {
        return new TopicExchange(exchangeName, true, false);
    }

    @Bean
    public Binding kudosBinding(Queue kudosQueue, TopicExchange kudosExchange) {
        return BindingBuilder.bind(kudosQueue).to(kudosExchange).with(routingKey);
    }
}