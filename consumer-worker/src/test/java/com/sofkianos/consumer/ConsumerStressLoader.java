package com.sofkianos.consumer;

import com.sofkianos.consumer.config.RabbitConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import com.sofkianos.consumer.service.KudoService;


@SpringBootTest
class ConsumerStressLoader {

  private static final int MESSAGE_COUNT = 500;