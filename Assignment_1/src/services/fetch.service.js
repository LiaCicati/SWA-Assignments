import { Temperature, Precipitation, Wind, CloudCoverage } from "../models/models.js";

const citySelect = document.getElementById("citySelect");
const temperatureInput = document.getElementById("temperatureInput");
const precipitationInput = document.getElementById("precipitationInput");
const precipitationType = document.getElementById("precipitationType");
const windSpeedInput = document.getElementById("windSpeedInput");
const windDirection = document.getElementById("windDirection");
const cloudCoverageInput = document.getElementById("cloudCoverageInput");

document
  .getElementById("weatherForm")
  .addEventListener("submit", handleFormSubmit);

function handleFormSubmit(event) {
  event.preventDefault();

  const weatherData = generateWeatherData();

  sendWeatherData(weatherData);
}

function generateWeatherData() {
  const city = citySelect.value;
  const timestamp = new Date().toISOString();

  const config = [
    {
      model: Temperature,
      inputs: [timestamp, city, temperatureInput.value, "temperature", "°C"],
    },
    {
      model: Precipitation,
      inputs: [
        timestamp,
        city,
        precipitationInput.value,
        "precipitation",
        "mm",
        precipitationType.value,
      ],
    },
    {
      model: Wind,
      inputs: [
        timestamp,
        city,
        windSpeedInput.value,
        "wind speed",
        "m/s",
        windDirection.value,
      ],
    },
    {
      model: CloudCoverage,
      inputs: [
        timestamp,
        city,
        cloudCoverageInput.value,
        "cloud coverage",
        "%",
      ],
    },
  ];

  return config.map(({ model, inputs }) => {
    const instance = new model(...inputs);
    return instance.getData();
  });
}

function sendWeatherData(data) {
  fetch("http://localhost:8080/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      displaySentData(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function displaySentData(data) {
  const container = document.getElementById("sentDataContainer");
  while (container.firstChild) {
    container.removeChild(container.lastChild);
  }

  const heading = document.createElement("h2");
  heading.textContent = "Sent Weather Data:";
  container.appendChild(heading);

  if (data && data.length > 0) {
    data.forEach((entry) => {
      appendTextElement(container, "Type", entry.type);
      appendTextElement(container, "City", entry.place);

      switch (entry.type) {
        case "temperature":
          appendTextElement(
            container,
            "Temperature",
            `${entry.value}${entry.unit}`
          );
          break;
        case "precipitation":
          appendTextElement(container, "Value", `${entry.value} ${entry.unit}`);
          break;
        case "wind speed":
          appendTextElement(container, "Value", `${entry.value} ${entry.unit}`);
          appendTextElement(container, "Direction", entry.direction);
          break;
        case "cloud coverage":
          appendTextElement(container, "Value", `${entry.value} ${entry.unit}`);
          break;
        default:
          appendTextElement(
            container,
            "Value",
            `${entry.value || "Not available"} ${entry.unit}`
          );
      }

      const separator = document.createElement("hr");
      container.appendChild(separator);
    });
  } else {
    container.textContent = "No data available.";
  }
}

function appendTextElement(container, label, text) {
  const element = document.createElement("div");
  const strongElement = document.createElement("strong");
  strongElement.textContent = label;
  element.appendChild(strongElement);

  const textNode = document.createTextNode(` ${text}`);
  element.appendChild(textNode);

  container.appendChild(element);
}
