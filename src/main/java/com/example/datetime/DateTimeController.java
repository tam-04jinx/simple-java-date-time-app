package com.example.datetime;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DateTimeController {

    @GetMapping("/api/datetime")
    public DateTimeResponse getCurrentDateTime() {
        ZonedDateTime now = ZonedDateTime.now();

        return new DateTimeResponse(
                LocalDate.now().format(DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy")),
                LocalTime.now().format(DateTimeFormatter.ofPattern("hh:mm:ss a")),
                now.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME),
                now.getZone().toString()
        );
    }

    public record DateTimeResponse(
            String date,
            String time,
            String dateTime,
            String timeZone
    ) {}
}
