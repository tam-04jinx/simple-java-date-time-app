package com.example.datetime;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DateTimeController {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("hh:mm:ss a");

    @GetMapping("/api/datetime")
    public DateTimeResponse getCurrentDateTime() {
        ZonedDateTime now = ZonedDateTime.now();

        return new DateTimeResponse(
                now.format(DATE_FORMATTER),
                now.format(TIME_FORMATTER),
                now.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME),
                now.getZone().toString()
        );
    }

    @GetMapping("/api/timezones")
    public List<TimeZoneResponse> getTimeZones() {
        return List.of(
                createTimeZoneResponse("Austin", "America/Chicago"),
                createTimeZoneResponse("New York", "America/New_York"),
                createTimeZoneResponse("Los Angeles", "America/Los_Angeles"),
                createTimeZoneResponse("Mexico City", "America/Mexico_City"),
                createTimeZoneResponse("Sao Paulo", "America/Sao_Paulo"),
                createTimeZoneResponse("London", "Europe/London"),
                createTimeZoneResponse("Paris", "Europe/Paris"),
                createTimeZoneResponse("Cairo", "Africa/Cairo"),
                createTimeZoneResponse("Dubai", "Asia/Dubai"),
                createTimeZoneResponse("Hyderabad", "Asia/Kolkata"),
                createTimeZoneResponse("Singapore", "Asia/Singapore"),
                createTimeZoneResponse("Hong Kong", "Asia/Hong_Kong"),
                createTimeZoneResponse("Tokyo", "Asia/Tokyo"),
                createTimeZoneResponse("Seoul", "Asia/Seoul"),
                createTimeZoneResponse("Sydney", "Australia/Sydney"),
                createTimeZoneResponse("Auckland", "Pacific/Auckland")
        );
    }

    private TimeZoneResponse createTimeZoneResponse(String city, String zoneId) {
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of(zoneId));

        return new TimeZoneResponse(
                city,
                zoneId,
                now.format(DATE_FORMATTER),
                now.format(TIME_FORMATTER),
                now.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)
        );
    }

    public record DateTimeResponse(
            String date,
            String time,
            String dateTime,
            String timeZone
    ) {}

    public record TimeZoneResponse(
            String city,
            String zoneId,
            String date,
            String time,
            String dateTime
    ) {}
}
