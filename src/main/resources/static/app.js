const dateElement = document.querySelector("#date");
const timeElement = document.querySelector("#time");
const timezoneElement = document.querySelector("#timezone");
const timezoneListElement = document.querySelector("#timezone-list");
const selectedTimeElement = document.querySelector("#selected-time");
const refreshButton = document.querySelector("#refresh-button");

const cityCoordinates = {
    Austin: [30.2672, -97.7431],
    "New York": [40.7128, -74.0060],
    London: [51.5074, -0.1278],
    Hyderabad: [17.3850, 78.4867],
    Tokyo: [35.6762, 139.6503],
    Sydney: [-33.8688, 151.2093]
};

let latestTimeZones = [];
let selectedCity = "Austin";
let worldMap;
let cityMarkers = {};

function initializeMap() {
    worldMap = L.map("world-map", {
        worldCopyJump: true,
        scrollWheelZoom: false
    }).setView([20, 10], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 6,
        minZoom: 2,
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(worldMap);
}

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
    Object.values(cityMarkers).forEach(marker => marker.remove());
    cityMarkers = {};

    timeZones
        .filter(timeZone => cityCoordinates[timeZone.city])
        .forEach(timeZone => {
            const marker = L.marker(cityCoordinates[timeZone.city])
                .addTo(worldMap)
                .bindTooltip(`${timeZone.city}: ${timeZone.time}`, {
                    direction: "top",
                    offset: [0, -8]
                })
                .on("click", () => {
                    selectedCity = timeZone.city;
                    showSelectedCity(selectedCity);
                });

            cityMarkers[timeZone.city] = marker;
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

    const marker = cityMarkers[timeZone.city];
    if (marker) {
        marker.openTooltip();
    }
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

initializeMap();
loadDateTime();
setInterval(loadDateTime, 1000);
