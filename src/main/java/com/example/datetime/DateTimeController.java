package com.example.datetime;

import java.time.DateTimeException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DateTimeController {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("hh:mm:ss a");
    private static final DateTimeFormatter TIME_24_HOUR_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");

    @GetMapping("/api/datetime")
    public DateTimeResponse getCurrentDateTime(@RequestParam(defaultValue = "system") String zone) {
        ZoneSelection zoneSelection = resolveZone(zone);
        ZonedDateTime now = ZonedDateTime.now(zoneSelection.zoneId());

        return new DateTimeResponse(
                now.format(DATE_FORMATTER),
                now.format(TIME_FORMATTER),
                now.format(TIME_24_HOUR_FORMATTER),
                now.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME),
                now.getZone().toString(),
                now.getOffset().toString(),
                now.getDayOfWeek().toString(),
                now.getDayOfYear(),
                now.toEpochSecond(),
                zoneSelection.fallback()
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

    private ZoneSelection resolveZone(String zone) {
        if (zone == null || zone.isBlank() || zone.equalsIgnoreCase("system")) {
            return new ZoneSelection(ZoneId.systemDefault(), false);
        }

        try {
            return new ZoneSelection(ZoneId.of(zone), false);
        } catch (DateTimeException exception) {
            return new ZoneSelection(ZoneId.systemDefault(), true);
        }
    }

    private TimeZoneResponse createTimeZoneResponse(String city, String zoneId) {
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of(zoneId));

        return new TimeZoneResponse(
                city,
                zoneId,
                now.format(DATE_FORMATTER),
                now.format(TIME_FORMATTER),
                now.format(TIME_24_HOUR_FORMATTER),
                now.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME),
                now.getOffset().toString(),
                now.getDayOfWeek().toString(),
                now.getDayOfYear(),
                now.toEpochSecond()
        );
    }

    public record DateTimeResponse(
            String date,
            String time,
            String time24Hour,
            String dateTime,
            String timeZone,
            String utcOffset,
            String dayOfWeek,
            int dayOfYear,
            long epochSeconds,
            boolean fallback
    ) {}

    public record TimeZoneResponse(
            String city,
            String zoneId,
            String date,
            String time,
            String time24Hour,
            String dateTime,
            String utcOffset,
            String dayOfWeek,
            int dayOfYear,
            long epochSeconds
    ) {}

    private record ZoneSelection(ZoneId zoneId, boolean fallback) {}
}
