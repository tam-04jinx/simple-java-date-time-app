const dateElement = document.querySelector("#date");
const timeElement = document.querySelector("#time");
const timezoneElement = document.querySelector("#timezone");
const timezoneListElement = document.querySelector("#timezone-list");
const refreshButton = document.querySelector("#refresh-button");

async function loadDateTime() {
    try {
        const [dateTimeResponse, timeZonesResponse] = await Promise.all([
            fetch("/api/datetime"),
            fetch("/api/timezones")
        ]);

        if (!dateTimeResponse.ok || !timeZonesResponse.ok) {
            throw new Error("Could not load date and time");
        }

        const dateTime = await dateTimeResponse.json();
        const timeZones = await timeZonesResponse.json();

        dateElement.textContent = dateTime.date;
        timeElement.textContent = dateTime.time;
        timezoneElement.textContent = dateTime.timeZone;
        renderTimeZones(timeZones);
    } catch (error) {
        dateElement.textContent = "Unavailable";
        timeElement.textContent = "Unavailable";
        timezoneElement.textContent = "Check the Java backend";
        timezoneListElement.innerHTML = "<p class='error'>Unable to load time zones.</p>";
        console.error(error);
    }
}

function renderTimeZones(timeZones) {
    timezoneListElement.innerHTML = timeZones
        .map(timeZone => `
            <article class="timezone-card">
                <span class="city">${timeZone.city}</span>
                <strong>${timeZone.time}</strong>
                <span>${timeZone.date}</span>
                <small>${timeZone.zoneId}</small>
            </article>
        `)
        .join("");
}

refreshButton.addEventListener("click", loadDateTime);

loadDateTime();
setInterval(loadDateTime, 1000);
