package com.sofkianos.consumer.component;

import com.sofkianos.consumer.config.RabbitConfig;
import com.sofkianos.consumer.domain.events.KudoEvent;
import com.sofkianos.consumer.service.KudoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;


@Slf4j
@Component
@RequiredArgsConstructor
public class KudosConsumer {
    private final KudoService kudoService;

    @RabbitListener(queues = RabbitConfig.QUEUE_NAME)
    public void handleKudo(@Payload KudoEvent message) {
        log.info("Processing started: from={}, to={}, category={}",
                message.getFrom(), message.getTo(), message.getCategory());

        long start = System.currentTimeMillis();

        kudoService.saveKudo(message);

        long elapsed = System.currentTimeMillis() - start;
        log.info("Processing finished: from={}, to={} ({} ms)",
                message.getFrom(), message.getTo(), elapsed);
    }
}