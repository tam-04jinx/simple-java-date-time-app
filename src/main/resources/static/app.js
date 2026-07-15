const dateElement = document.querySelector("#date");
const timeElement = document.querySelector("#time");
const timezoneElement = document.querySelector("#timezone");
const timezoneListElement = document.querySelector("#timezone-list");
const selectedTimeElement = document.querySelector("#selected-time");
const citySelectElement = document.querySelector("#city-select");
const cityCountElement = document.querySelector("#city-count");
const timeSpreadElement = document.querySelector("#time-spread");
const themeButtons = document.querySelectorAll(".theme-button");
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
let mapAvailable = false;

function getDayPhase(dateTime) {
    const hour = getHourFromDateTime(dateTime);

    if (hour >= 6 && hour < 18) {
        return { icon: "☀", label: "Day", value: "day" };
    }

    if ((hour >= 5 && hour < 6) || (hour >= 18 && hour < 20)) {
        return { icon: "◐", label: "Twilight", value: "twilight" };
    }

    return { icon: "☾", label: "Night", value: "night" };
}

function applyTheme(theme) {
    document.body.dataset.theme = theme;
    themeButtons.forEach(button => {
        button.setAttribute("aria-pressed", String(button.dataset.theme === theme));
    });
    localStorage.setItem("worldClockTheme", theme);
}

function initializeMap() {
    if (typeof L === "undefined") {
        document.querySelector("#world-map").innerHTML = `
            <div class="map-fallback">
                <span>Map offline</span>
                <strong>City cards still update live.</strong>
            </div>
        `;
        return;
    }

    worldMap = L.map("world-map", {
        worldCopyJump: true,
        scrollWheelZoom: false
    }).setView([20, 10], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 6,
        minZoom: 2,
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(worldMap);

    mapAvailable = true;
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
        updateInsights();
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
    if (!mapAvailable) {
        return;
    }

    Object.values(cityMarkers).forEach(marker => marker.remove());
    cityMarkers = {};

    timeZones
        .filter(timeZone => cityCoordinates[timeZone.city])
        .forEach(timeZone => {
            const phase = getDayPhase(timeZone.dateTime);
            const marker = L.marker(cityCoordinates[timeZone.city], {
                icon: L.divIcon({
                    className: "day-night-marker-wrap",
                    html: `
                        <span class="day-night-marker is-${phase.value}" aria-label="${timeZone.city} is in ${phase.label.toLowerCase()}">
                            ${phase.icon}
                        </span>
                    `,
                    iconSize: [38, 38],
                    iconAnchor: [19, 19],
                    tooltipAnchor: [0, -18]
                })
            })
                .addTo(worldMap)
                .bindTooltip(`${timeZone.city}: ${timeZone.time} · ${phase.label}`, {
                    direction: "top",
                    offset: [0, -12]
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
        <span>${getDayPhase(timeZone.dateTime).label}</span>
        <small>${timeZone.zoneId}</small>
    `;

    const marker = cityMarkers[timeZone.city];
    if (marker) {
        marker.openTooltip();
    }

    document.querySelectorAll(".timezone-card").forEach(card => {
        card.classList.toggle("is-active", card.dataset.city === timeZone.city);
    });
}

function renderTimeZones(timeZones) {
    if (timeZones.length === 0) {
        timezoneListElement.innerHTML = "<p class='error'>No cities selected.</p>";
        return;
    }

    timezoneListElement.innerHTML = timeZones
        .map(timeZone => {
            const phase = getDayPhase(timeZone.dateTime);
            return `
            <button class="timezone-card is-${phase.value}" type="button" data-city="${timeZone.city}">
                <span class="city">${timeZone.city}</span>
                <strong>${timeZone.time}</strong>
                <span>${timeZone.date}</span>
                <span>${phase.label}</span>
                <small>${timeZone.zoneId}</small>
            </button>
        `;
        })
        .join("");

    timezoneListElement.querySelectorAll(".timezone-card").forEach(card => {
        card.addEventListener("click", () => {
            selectedCity = card.dataset.city;
            showSelectedCity(selectedCity);
        });
    });
}

function getHourFromDateTime(dateTime) {
    return Number(dateTime.match(/T(\d{2})/)?.[1] || 0);
}

function updateInsights() {
    const selectedTimeZones = getSelectedTimeZones();

    cityCountElement.textContent = `${selectedTimeZones.length} ${selectedTimeZones.length === 1 ? "city" : "cities"} selected`;

    if (selectedTimeZones.length < 2) {
        timeSpreadElement.textContent = "Add cities to compare time spread";
        return;
    }

    const hours = selectedTimeZones
        .map(timeZone => getHourFromDateTime(timeZone.dateTime))
        .sort((first, second) => first - second);
    const gaps = hours.map((hour, index) => {
        const nextHour = hours[(index + 1) % hours.length];
        return (nextHour - hour + 24) % 24;
    });
    const spread = 24 - Math.max(...gaps);
    timeSpreadElement.textContent = `${spread} hour spread across selected cities`;
}

citySelectElement.addEventListener("change", () => {
    selectedCities = Array.from(citySelectElement.selectedOptions).map(option => option.value);
    renderSelectedView();
    updateInsights();
});

refreshButton.addEventListener("click", loadDateTime);
themeButtons.forEach(button => {
    button.addEventListener("click", () => applyTheme(button.dataset.theme));
});

applyTheme(localStorage.getItem("worldClockTheme") || "aurora");
initializeMap();
loadDateTime();
setInterval(loadDateTime, 1000);
