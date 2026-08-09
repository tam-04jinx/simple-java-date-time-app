package com.example.datetime;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
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
    private static final double ZENITH = 90.833;

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
                createTimeZoneResponse("Austin", "America/Chicago", 30.2672, -97.7431),
                createTimeZoneResponse("New York", "America/New_York", 40.7128, -74.0060),
                createTimeZoneResponse("Los Angeles", "America/Los_Angeles", 34.0522, -118.2437),
                createTimeZoneResponse("Mexico City", "America/Mexico_City", 19.4326, -99.1332),
                createTimeZoneResponse("Sao Paulo", "America/Sao_Paulo", -23.5505, -46.6333),
                createTimeZoneResponse("London", "Europe/London", 51.5074, -0.1278),
                createTimeZoneResponse("Paris", "Europe/Paris", 48.8566, 2.3522),
                createTimeZoneResponse("Cairo", "Africa/Cairo", 30.0444, 31.2357),
                createTimeZoneResponse("Dubai", "Asia/Dubai", 25.2048, 55.2708),
                createTimeZoneResponse("Hyderabad", "Asia/Kolkata", 17.3850, 78.4867),
                createTimeZoneResponse("Singapore", "Asia/Singapore", 1.3521, 103.8198),
                createTimeZoneResponse("Hong Kong", "Asia/Hong_Kong", 22.3193, 114.1694),
                createTimeZoneResponse("Tokyo", "Asia/Tokyo", 35.6762, 139.6503),
                createTimeZoneResponse("Seoul", "Asia/Seoul", 37.5665, 126.9780),
                createTimeZoneResponse("Sydney", "Australia/Sydney", -33.8688, 151.2093),
                createTimeZoneResponse("Auckland", "Pacific/Auckland", -36.8485, 174.7633)
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

    private TimeZoneResponse createTimeZoneResponse(String city, String zoneId, double latitude, double longitude) {
        ZoneId cityZone = ZoneId.of(zoneId);
        ZonedDateTime now = ZonedDateTime.now(cityZone);
        SolarTimes solarTimes = calculateSolarTimes(now.toLocalDate(), cityZone, latitude, longitude);

        return new TimeZoneResponse(
                city,
                zoneId,
                latitude,
                longitude,
                now.format(DATE_FORMATTER),
                now.format(TIME_FORMATTER),
                now.format(TIME_24_HOUR_FORMATTER),
                now.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME),
                now.getOffset().toString(),
                now.getDayOfWeek().toString(),
                now.getDayOfYear(),
                now.toEpochSecond(),
                solarTimes.sunrise(),
                solarTimes.sunset()
        );
    }

    private SolarTimes calculateSolarTimes(LocalDate date, ZoneId zoneId, double latitude, double longitude) {
        LocalTime sunriseUtc = calculateSolarEvent(date, latitude, longitude, true);
        LocalTime sunsetUtc = calculateSolarEvent(date, latitude, longitude, false);

        return new SolarTimes(
                formatLocalSolarTime(date, zoneId, sunriseUtc),
                formatLocalSolarTime(date, zoneId, sunsetUtc)
        );
    }

    private String formatLocalSolarTime(LocalDate date, ZoneId zoneId, LocalTime utcTime) {
        if (utcTime == null) {
            return "Unavailable";
        }

        return ZonedDateTime.of(date, utcTime, ZoneOffset.UTC)
                .withZoneSameInstant(zoneId)
                .format(TIME_FORMATTER);
    }

    private LocalTime calculateSolarEvent(LocalDate date, double latitude, double longitude, boolean sunrise) {
        int dayOfYear = date.getDayOfYear();
        double longitudeHour = longitude / 15;
        double approximateTime = dayOfYear + ((sunrise ? 6 : 18) - longitudeHour) / 24;
        double meanAnomaly = (0.9856 * approximateTime) - 3.289;
        double trueLongitude = normalizeDegrees(meanAnomaly
                + (1.916 * Math.sin(Math.toRadians(meanAnomaly)))
                + (0.020 * Math.sin(Math.toRadians(2 * meanAnomaly)))
                + 282.634);
        double rightAscension = normalizeDegrees(Math.toDegrees(Math.atan(0.91764 * Math.tan(Math.toRadians(trueLongitude)))));
        rightAscension += Math.floor(trueLongitude / 90) * 90 - Math.floor(rightAscension / 90) * 90;
        rightAscension /= 15;

        double sinDeclination = 0.39782 * Math.sin(Math.toRadians(trueLongitude));
        double cosDeclination = Math.cos(Math.asin(sinDeclination));
        double localHourCosine = (Math.cos(Math.toRadians(ZENITH))
                - (sinDeclination * Math.sin(Math.toRadians(latitude))))
                / (cosDeclination * Math.cos(Math.toRadians(latitude)));

        if (localHourCosine > 1 || localHourCosine < -1) {
            return null;
        }

        double localHour = sunrise
                ? 360 - Math.toDegrees(Math.acos(localHourCosine))
                : Math.toDegrees(Math.acos(localHourCosine));
        localHour /= 15;

        double localMeanTime = localHour + rightAscension - (0.06571 * approximateTime) - 6.622;
        double utcHour = normalizeHours(localMeanTime - longitudeHour);
        long seconds = Math.round(utcHour * 3600);
        return LocalTime.MIDNIGHT.plusSeconds(Math.floorMod(seconds, 86_400));
    }

    private double normalizeDegrees(double degrees) {
        return ((degrees % 360) + 360) % 360;
    }

    private double normalizeHours(double hours) {
        return ((hours % 24) + 24) % 24;
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
            double latitude,
            double longitude,
            String date,
            String time,
            String time24Hour,
            String dateTime,
            String utcOffset,
            String dayOfWeek,
            int dayOfYear,
            long epochSeconds,
            String sunrise,
            String sunset
    ) {}

    private record ZoneSelection(ZoneId zoneId, boolean fallback) {}

    private record SolarTimes(String sunrise, String sunset) {}
}
