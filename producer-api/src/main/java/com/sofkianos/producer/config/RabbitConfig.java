package com.sofkianos.producer.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
    public DirectExchange kudosExchange() {
        return new DirectExchange(exchangeName, true, false);
    }

    @Bean
    public Binding kudosBinding(Queue kudosQueue, DirectExchange kudosExchange) {
        return BindingBuilder.bind(kudosQueue).to(kudosExchange).with(routingKey);
    }
}
