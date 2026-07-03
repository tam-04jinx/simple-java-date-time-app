package com.example.datetime;

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;
import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.beans.factory.annotation.Autowired;

@SpringBootTest(webEnvironment = RANDOM_PORT)
class ApplicationHealthTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void healthEndpointShouldBeAvailable() {
        String response = restTemplate.getForObject("/actuator/health", String.class);

        assertThat(response).contains("UP");
    }
}
