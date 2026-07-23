const dateElement = document.querySelector("#date");
const timeElement = document.querySelector("#time");
const timezoneElement = document.querySelector("#timezone");
const timezoneListElement = document.querySelector("#timezone-list");
const selectedTimeElement = document.querySelector("#selected-time");
const citySelectElement = document.querySelector("#city-select");
const cityCountElement = document.querySelector("#city-count");
const timeSpreadElement = document.querySelector("#time-spread");
const meetingWindowElement = document.querySelector("#meeting-window");
const favoriteListElement = document.querySelector("#favorite-list");
const shareButton = document.querySelector("#share-button");
const shareStatusElement = document.querySelector("#share-status");
const sunlightOverlayElement = document.querySelector("#sunlight-overlay");
const sunlightStatusElement = document.querySelector("#sunlight-status");
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
const workdayStartHour = 9;
const workdayEndHour = 17;

let latestTimeZones = [];
let selectedCity = "Austin";
let selectedCities = loadInitialCities();
let favoriteCities = loadFavoriteCities();
let worldMap;
let cityMarkers = {};
let mapAvailable = false;

function loadInitialCities() {
    const sharedCities = new URLSearchParams(window.location.search).get("cities");
    if (sharedCities) {
        return sharedCities.split(",").filter(Boolean);
    }

    const savedCities = JSON.parse(localStorage.getItem("worldClockSelectedCities") || "null");
    return Array.isArray(savedCities) && savedCities.length > 0 ? savedCities : [...defaultSelectedCities];
}

function loadFavoriteCities() {
    const savedFavorites = JSON.parse(localStorage.getItem("worldClockFavoriteCities") || "null");
    return Array.isArray(savedFavorites) ? savedFavorites : ["Austin", "London"];
}

function persistSelections() {
    localStorage.setItem("worldClockSelectedCities", JSON.stringify(selectedCities));
    localStorage.setItem("worldClockFavoriteCities", JSON.stringify(favoriteCities));
}

function updateUrlState() {
    const url = new URL(window.location.href);
    url.searchParams.set("cities", selectedCities.join(","));
    url.searchParams.set("theme", document.body.dataset.theme || "aurora");
    window.history.replaceState({}, "", url);
}

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

function getWorkWindow(dateTime) {
    const hour = getHourFromDateTime(dateTime);
    const friendly = hour >= workdayStartHour && hour < workdayEndHour;
    return {
        friendly,
        label: friendly ? "Work hours" : "After hours"
    };
}

function applyTheme(theme) {
    document.body.dataset.theme = theme;
    themeButtons.forEach(button => {
        button.setAttribute("aria-pressed", String(button.dataset.theme === theme));
    });
    localStorage.setItem("worldClockTheme", theme);
    updateUrlState();
}

function initializeMap() {
    if (typeof L === "undefined") {
        document.querySelector("#world-map").innerHTML = `
            <div class="map-fallback">
                <span>Map offline</span>
                <strong>City cards still update live.</strong>
            </div>
        `;
        updateSunlightOverlay();
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
    updateSunlightOverlay();
}

function updateSunlightOverlay() {
    if (!sunlightOverlayElement) {
        return;
    }

    const now = new Date();
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes() + now.getUTCSeconds() / 60;
    const sunLongitude = 180 - (utcMinutes / 1440) * 360;
    const normalizedSunLongitude = ((sunLongitude + 540) % 360) - 180;
    const sunX = ((normalizedSunLongitude + 180) / 360) * 100;
    const shadowX = (sunX + 50) % 100;
    const twilightWidth = 12 + Math.abs(Math.sin((utcMinutes / 1440) * Math.PI * 2)) * 6;

    sunlightOverlayElement.style.setProperty("--sun-x", `${sunX}%`);
    sunlightOverlayElement.style.setProperty("--shadow-x", `${shadowX}%`);
    sunlightOverlayElement.style.setProperty("--twilight-width", `${twilightWidth}%`);

    if (sunlightStatusElement) {
        sunlightStatusElement.textContent = `Live light at ${formatLongitude(normalizedSunLongitude)} · shadow opposite`;
    }
}

function formatLongitude(longitude) {
    const absoluteLongitude = Math.round(Math.abs(longitude));
    if (absoluteLongitude === 0 || absoluteLongitude === 180) {
        return `${absoluteLongitude}°`;
    }

    return longitude > 0 ? `${absoluteLongitude}°E` : `${absoluteLongitude}°W`;
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
        selectedCities = selectedCities.filter(city => latestTimeZones.some(timeZone => timeZone.city === city));
        if (selectedCities.length === 0) {
            selectedCities = [...defaultSelectedCities];
        }

        dateElement.textContent = dateTime.date;
        timeElement.textContent = dateTime.time;
        timezoneElement.textContent = dateTime.timeZone;
        renderCitySelect(latestTimeZones);
        syncCitySelect();
        renderSelectedView();
        updateInsights();
        updateSunlightOverlay();
        persistSelections();
        updateUrlState();
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

function syncCitySelect() {
    Array.from(citySelectElement.options).forEach(option => {
        option.selected = selectedCities.includes(option.value);
    });
}

function getSelectedTimeZones() {
    return latestTimeZones.filter(timeZone => selectedCities.includes(timeZone.city));
}

function renderSelectedView() {
    const selectedTimeZones = getSelectedTimeZones();

    if (!selectedTimeZones.some(timeZone => timeZone.city === selectedCity)) {
        selectedCity = selectedTimeZones[0]?.city || "";
    }

    renderFavorites();
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
            const workWindow = getWorkWindow(timeZone.dateTime);
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
                .bindTooltip(`${timeZone.city}: ${timeZone.time} · ${phase.label} · ${workWindow.label}`, {
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

    const workWindow = getWorkWindow(timeZone.dateTime);
    selectedTimeElement.innerHTML = `
        <span class="city">${timeZone.city}</span>
        <strong>${timeZone.time}</strong>
        <span>${timeZone.date}</span>
        <span>${getDayPhase(timeZone.dateTime).label} · ${workWindow.label}</span>
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

function renderFavorites() {
    if (favoriteCities.length === 0) {
        favoriteListElement.innerHTML = "<span class='favorite-empty'>Mark cards as favorites to pin them here.</span>";
        return;
    }

    favoriteListElement.innerHTML = favoriteCities
        .filter(city => latestTimeZones.some(timeZone => timeZone.city === city))
        .map(city => `
            <button class="favorite-chip" type="button" data-city="${city}">
                ${city}
            </button>
        `)
        .join("");

    favoriteListElement.querySelectorAll(".favorite-chip").forEach(button => {
        button.addEventListener("click", () => {
            if (!selectedCities.includes(button.dataset.city)) {
                selectedCities = [...selectedCities, button.dataset.city];
            }
            selectedCity = button.dataset.city;
            syncCitySelect();
            renderSelectedView();
            updateInsights();
            persistSelections();
            updateUrlState();
        });
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
            const workWindow = getWorkWindow(timeZone.dateTime);
            const favorite = favoriteCities.includes(timeZone.city);
            return `
            <article class="timezone-card is-${phase.value} ${workWindow.friendly ? "is-work-friendly" : "is-after-hours"}" data-city="${timeZone.city}">
                <button class="favorite-button" type="button" aria-pressed="${favorite}" aria-label="${favorite ? "Remove" : "Add"} ${timeZone.city} favorite" data-city="${timeZone.city}">
                    ${favorite ? "★" : "☆"}
                </button>
                <button class="timezone-card-main" type="button" data-city="${timeZone.city}">
                    <span class="city">${timeZone.city}</span>
                    <strong>${timeZone.time}</strong>
                    <span>${timeZone.date}</span>
                    <span>${phase.label} · ${workWindow.label}</span>
                    <small>${timeZone.zoneId}</small>
                </button>
            </article>
        `;
        })
        .join("");

    timezoneListElement.querySelectorAll(".timezone-card-main").forEach(card => {
        card.addEventListener("click", () => {
            selectedCity = card.dataset.city;
            showSelectedCity(selectedCity);
        });
    });

    timezoneListElement.querySelectorAll(".favorite-button").forEach(button => {
        button.addEventListener("click", () => toggleFavorite(button.dataset.city));
    });
}

function toggleFavorite(city) {
    favoriteCities = favoriteCities.includes(city)
        ? favoriteCities.filter(item => item !== city)
        : [...favoriteCities, city];

    renderFavorites();
    renderTimeZones(getSelectedTimeZones());
    showSelectedCity(selectedCity);
    persistSelections();
}

function getHourFromDateTime(dateTime) {
    return Number(dateTime.match(/T(\d{2})/)?.[1] || 0);
}

function updateInsights() {
    const selectedTimeZones = getSelectedTimeZones();

    cityCountElement.textContent = `${selectedTimeZones.length} ${selectedTimeZones.length === 1 ? "city" : "cities"} selected`;

    if (selectedTimeZones.length < 2) {
        timeSpreadElement.textContent = "Add cities to compare time spread";
        meetingWindowElement.textContent = "Add cities for meeting insight";
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
    const workFriendlyCount = selectedTimeZones.filter(timeZone => getWorkWindow(timeZone.dateTime).friendly).length;

    timeSpreadElement.textContent = `${spread} hour spread across selected cities`;
    meetingWindowElement.textContent = workFriendlyCount === selectedTimeZones.length
        ? "All selected cities are in work hours"
        : `${workFriendlyCount}/${selectedTimeZones.length} selected cities are in work hours`;
}

function copyShareLink() {
    updateUrlState();
    const shareUrl = window.location.href;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(() => {
            shareStatusElement.textContent = "Share link copied";
        });
        return;
    }

    shareStatusElement.textContent = shareUrl;
}

citySelectElement.addEventListener("change", () => {
    selectedCities = Array.from(citySelectElement.selectedOptions).map(option => option.value);
    renderSelectedView();
    updateInsights();
    persistSelections();
    updateUrlState();
});

refreshButton.addEventListener("click", loadDateTime);
shareButton.addEventListener("click", copyShareLink);
themeButtons.forEach(button => {
    button.addEventListener("click", () => applyTheme(button.dataset.theme));
});

applyTheme(new URLSearchParams(window.location.search).get("theme") || localStorage.getItem("worldClockTheme") || "aurora");
initializeMap();
loadDateTime();
setInterval(loadDateTime, 1000);
setInterval(updateSunlightOverlay, 60000);
