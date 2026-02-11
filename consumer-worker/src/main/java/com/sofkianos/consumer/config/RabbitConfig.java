package com.sofkianos.consumer.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * RabbitMQ topology for the Consumer Worker — including Dead Letter Queue (DLQ).
 *
 * <pre>
 *  Producer ──▶ kudos.exchange ──▶ kudos.queue
 *                                      │ (on reject/expire)
 *                                      ▼
 *                                 kudos.dlx ──▶ kudos.dlq
 * </pre>
 *
 * <p>When a message in {@code kudos.queue} is NACKed (rejected) or its TTL
 * expires, RabbitMQ automatically routes it to the Dead Letter Exchange
 * ({@code kudos.dlx}), which in turn delivers it to {@code kudos.dlq}
 * for later inspection or replay.</p>
 */
@Configuration
public class RabbitConfig {

    // ── Main topology ───────────────────────────────────────────────────
    public static final String QUEUE_NAME = "kudos.queue";
    public static final String EXCHANGE_NAME = "kudos.exchange";
    public static final String ROUTING_KEY = "kudos.key";

    // ── Dead Letter topology ────────────────────────────────────────────
    public static final String DLQ_QUEUE_NAME = "kudos.dlq";
    public static final String DLX_EXCHANGE_NAME = "kudos.dlx";

    // ═══════════════════════════════════════════════════════════════════
    //  Main Queue — wired to DLX on rejection
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Main durable queue with a dead-letter-exchange argument.
     * Any rejected or expired message is forwarded to {@code kudos.dlx}.
     */
    @Bean
    public Queue kudosQueue() {
        return QueueBuilder.durable(QUEUE_NAME)
                .withArgument("x-dead-letter-exchange", DLX_EXCHANGE_NAME)
                .build();
    }

    @Bean
    public TopicExchange kudosExchange() {
        return new TopicExchange(EXCHANGE_NAME, true, false);
    }

    @Bean
    public Binding kudosBinding(Queue kudosQueue, TopicExchange kudosExchange) {
        return BindingBuilder.bind(kudosQueue).to(kudosExchange).with(ROUTING_KEY);
    }

    // ═══════════════════════════════════════════════════════════════════
    //  Dead Letter Queue (DLQ)
    // ═══════════════════════════════════════════════════════════════════

    /** DLQ — collects failed messages for later inspection or replay. */
    @Bean
    public Queue kudosDlq() {
        return QueueBuilder.durable(DLQ_QUEUE_NAME).build();
    }

    /**
     * Dead Letter Exchange — fanout type so every rejected message
     * reaches the DLQ regardless of routing key.
     */
    @Bean
    public FanoutExchange kudosDlx() {
        return new FanoutExchange(DLX_EXCHANGE_NAME, true, false);
    }

    @Bean
    public Binding dlqBinding(Queue kudosDlq, FanoutExchange kudosDlx) {
        return BindingBuilder.bind(kudosDlq).to(kudosDlx);
    }

    // ═══════════════════════════════════════════════════════════════════
    //  Message Converter
    // ═══════════════════════════════════════════════════════════════════

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
