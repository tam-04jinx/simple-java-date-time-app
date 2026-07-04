const dateElement = document.querySelector("#date");
const timeElement = document.querySelector("#time");
const timezoneElement = document.querySelector("#timezone");
const timezoneListElement = document.querySelector("#timezone-list");
const selectedTimeElement = document.querySelector("#selected-time");
const citySelectElement = document.querySelector("#city-select");
const refreshButton = document.querySelector("#refresh-button");

const cityCoordinates = {
    Austin: [30.2672, -97.7431],
    "New York": [40.7128, -74.0060],
    "Los Angeles": [34.0522, -118.2437],
    "Mexico City": [19.4326, -99.1332],
    "Sao Paulo": [-23.5505, -46.6333],
    London: [51.5074, -0.1278],
    Paris: [48.8566, 2.3522],
    Cairo: [30.0444, 31.2357],
    Dubai: [25.2048, 55.2708],
    Hyderabad: [17.3850, 78.4867],
    Singapore: [1.3521, 103.8198],
    "Hong Kong": [22.3193, 114.1694],
    Tokyo: [35.6762, 139.6503],
    Seoul: [37.5665, 126.9780],
    Sydney: [-33.8688, 151.2093],
    Auckland: [-36.8485, 174.7633]
};

const defaultSelectedCities = ["Austin", "New York", "London", "Hyderabad", "Tokyo", "Sydney"];

let latestTimeZones = [];
let selectedCity = "Austin";
let selectedCities = [...defaultSelectedCities];
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
        renderCitySelect(latestTimeZones);
        renderSelectedView();
    } catch (error) {
        dateElement.textContent = "Unavailable";
        timeElement.textContent = "Unavailable";
        timezoneElement.textContent = "Check the Java backend";
        timezoneListElement.innerHTML = "<p class='error'>Unable to load time zones.</p>";
        selectedTimeElement.textContent = "Unable to load city times.";
        console.error(error);
    }
}

function renderCitySelect(timeZones) {
    if (citySelectElement.options.length > 0) {
        return;
    }

    citySelectElement.innerHTML = timeZones
        .map(timeZone => `
            <option value="${timeZone.city}" ${selectedCities.includes(timeZone.city) ? "selected" : ""}>
                ${timeZone.city}
            </option>
        `)
        .join("");
}

function getSelectedTimeZones() {
    return latestTimeZones.filter(timeZone => selectedCities.includes(timeZone.city));
}

function renderSelectedView() {
    const selectedTimeZones = getSelectedTimeZones();

    if (!selectedTimeZones.some(timeZone => timeZone.city === selectedCity)) {
        selectedCity = selectedTimeZones[0]?.city || "";
    }

    renderMapMarkers(selectedTimeZones);
    renderTimeZones(selectedTimeZones);
    showSelectedCity(selectedCity);
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
    const timeZone = latestTimeZones.find(item => item.city === city);

    if (!timeZone) {
        selectedTimeElement.textContent = "Select cities from the dropdown to show them on the map.";
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
    if (timeZones.length === 0) {
        timezoneListElement.innerHTML = "<p class='error'>No cities selected.</p>";
        return;
    }

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

citySelectElement.addEventListener("change", () => {
    selectedCities = Array.from(citySelectElement.selectedOptions).map(option => option.value);
    renderSelectedView();
});

refreshButton.addEventListener("click", loadDateTime);

initializeMap();
loadDateTime();
setInterval(loadDateTime, 1000);
