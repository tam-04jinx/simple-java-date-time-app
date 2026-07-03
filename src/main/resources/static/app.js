const dateElement = document.querySelector("#date");
const timeElement = document.querySelector("#time");
const timezoneElement = document.querySelector("#timezone");
const refreshButton = document.querySelector("#refresh-button");

async function loadDateTime() {
    try {
        const response = await fetch("/api/datetime");

        if (!response.ok) {
            throw new Error("Could not load date and time");
        }

        const data = await response.json();

        dateElement.textContent = data.date;
        timeElement.textContent = data.time;
        timezoneElement.textContent = data.timeZone;
    } catch (error) {
        dateElement.textContent = "Unavailable";
        timeElement.textContent = "Unavailable";
        timezoneElement.textContent = "Check the Java backend";
        console.error(error);
    }
}

refreshButton.addEventListener("click", loadDateTime);

loadDateTime();
setInterval(loadDateTime, 1000);
