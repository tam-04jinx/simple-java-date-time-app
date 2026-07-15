package com.example.datetime;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;

class DateTimeControllerTest {

    private final DateTimeController controller = new DateTimeController();

    @Test
    void shouldReturnCurrentDateTime() {
        DateTimeController.DateTimeResponse response = controller.getCurrentDateTime("system");

        assertThat(response.date()).isNotBlank();
        assertThat(response.time()).isNotBlank();
        assertThat(response.time24Hour()).isNotBlank();
        assertThat(response.dateTime()).isNotBlank();
        assertThat(response.timeZone()).isNotBlank();
        assertThat(response.utcOffset()).isNotBlank();
        assertThat(response.dayOfWeek()).isNotBlank();
        assertThat(response.dayOfYear()).isBetween(1, 366);
        assertThat(response.epochSeconds()).isPositive();
        assertThat(response.fallback()).isFalse();
    }

    @Test
    void shouldReturnRequestedTimezone() {
        DateTimeController.DateTimeResponse response = controller.getCurrentDateTime("UTC");

        assertThat(response.timeZone()).isEqualTo("UTC");
        assertThat(response.utcOffset()).isEqualTo("Z");
        assertThat(response.fallback()).isFalse();
    }

    @Test
    void shouldFallbackForInvalidTimezone() {
        DateTimeController.DateTimeResponse response = controller.getCurrentDateTime("Not/AZone");

        assertThat(response.timeZone()).isNotBlank();
        assertThat(response.fallback()).isTrue();
    }

    @Test
    void shouldReturnMultipleTimeZones() {
        List<DateTimeController.TimeZoneResponse> timeZones = controller.getTimeZones();

        assertThat(timeZones).hasSizeGreaterThanOrEqualTo(6);
        assertThat(timeZones.get(0).city()).isNotBlank();
        assertThat(timeZones.get(0).zoneId()).isNotBlank();
        assertThat(timeZones.get(0).date()).isNotBlank();
        assertThat(timeZones.get(0).time()).isNotBlank();
        assertThat(timeZones.get(0).time24Hour()).isNotBlank();
        assertThat(timeZones.get(0).dateTime()).isNotBlank();
        assertThat(timeZones.get(0).utcOffset()).isNotBlank();
        assertThat(timeZones.get(0).dayOfWeek()).isNotBlank();
        assertThat(timeZones.get(0).dayOfYear()).isBetween(1, 366);
        assertThat(timeZones.get(0).epochSeconds()).isPositive();
    }
}
