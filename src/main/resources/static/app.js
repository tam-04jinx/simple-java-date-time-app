const dateElement = document.querySelector("#date");
const timeElement = document.querySelector("#time");
const timezoneElement = document.querySelector("#timezone");
const timezoneListElement = document.querySelector("#timezone-list");
const mapMarkersElement = document.querySelector("#map-markers");
const selectedTimeElement = document.querySelector("#selected-time");
const refreshButton = document.querySelector("#refresh-button");

const cityPositions = {
    Austin: { left: 20, top: 43 },
    "New York": { left: 28, top: 36 },
    London: { left: 46, top: 31 },
    Hyderabad: { left: 68, top: 49 },
    Tokyo: { left: 82, top: 42 },
    Sydney: { left: 84, top: 72 }
};

let latestTimeZones = [];
let selectedCity = "Austin";

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
        latestTimeZones = await timeZonesResponse.json();

        dateElement.textContent = dateTime.date;
        timeElement.textContent = dateTime.time;
        timezoneElement.textContent = dateTime.timeZone;
        renderMapMarkers(latestTimeZones);
        renderTimeZones(latestTimeZones);
        showSelectedCity(selectedCity);
    } catch (error) {
        dateElement.textContent = "Unavailable";
        timeElement.textContent = "Unavailable";
        timezoneElement.textContent = "Check the Java backend";
        timezoneListElement.innerHTML = "<p class='error'>Unable to load time zones.</p>";
        selectedTimeElement.textContent = "Unable to load city times.";
        console.error(error);
    }
}

function renderMapMarkers(timeZones) {
    mapMarkersElement.innerHTML = timeZones
        .filter(timeZone => cityPositions[timeZone.city])
        .map(timeZone => {
            const position = cityPositions[timeZone.city];
            const activeClass = timeZone.city === selectedCity ? " active" : "";
            return `
                <button
                    class="map-marker${activeClass}"
                    style="left: ${position.left}%; top: ${position.top}%;"
                    type="button"
                    data-city="${timeZone.city}"
                    aria-label="Show time in ${timeZone.city}"
                >
                    <span>${timeZone.city}</span>
                </button>
            `;
        })
        .join("");

    document.querySelectorAll(".map-marker").forEach(marker => {
        marker.addEventListener("click", () => {
            selectedCity = marker.dataset.city;
            showSelectedCity(selectedCity);
            renderMapMarkers(latestTimeZones);
        });
    });
}

function showSelectedCity(city) {
    const timeZone = latestTimeZones.find(item => item.city === city) || latestTimeZones[0];

    if (!timeZone) {
        selectedTimeElement.textContent = "Select a city on the map to see the local time.";
        return;
    }

    selectedTimeElement.innerHTML = `
        <span class="city">${timeZone.city}</span>
        <strong>${timeZone.time}</strong>
        <span>${timeZone.date}</span>
        <small>${timeZone.zoneId}</small>
    `;
}

function renderTimeZones(timeZones) {
    timezoneListElement.innerHTML = timeZones
        .map(timeZone => `
            <article class="timezone-card" data-city="${timeZone.city}">
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
