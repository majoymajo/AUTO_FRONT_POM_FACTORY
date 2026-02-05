package com.sofkianos.producer.config;

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
    public DirectExchange kudosExchange() {
        return new DirectExchange(exchangeName, true, false);
    }

    @Bean
    public Binding kudosBinding(Queue kudosQueue, DirectExchange kudosExchange) {
        return BindingBuilder.bind(kudosQueue).to(kudosExchange).with(routingKey);
    }
}