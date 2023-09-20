import {
  WeatherPrediction,
  TemperaturePrediction,
  WindPrediction,
  CloudCoveragePrediction,
  PrecipitationPrediction,
} from "./models.js";

function fetchData(endpoint, city, callback) {
  const xhr = new XMLHttpRequest();
  const url = "http://localhost:8081/" + endpoint + "/" + city;

  xhr.open("GET", url, true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      callback(JSON.parse(xhr.responseText));
    } else {
      console.error(`Request failed. Returned status of ${xhr.status}`);
    }
  };
  xhr.send();
}
function formatTime(isoString) {
  const date = new Date(isoString);
  return (
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) +
    ", " +
    date.toLocaleDateString()
  );
}

function createPredictionObject(entry) {
  let weatherPrediction = new WeatherPrediction(
    entry.time,
    entry.place,
    entry.from,
    entry.to,
    entry.type,
    entry.unit
  );
  const predictionMapping = {
    temperature: TemperaturePrediction,
    precipitation: PrecipitationPrediction,
    "wind speed": WindPrediction,
    "cloud coverage": CloudCoveragePrediction,
  };

  if (predictionMapping[entry.type]) {
    Object.assign(
      weatherPrediction,
      new predictionMapping[entry.type](
        entry.time,
        entry.place,
        entry.from,
        entry.to,
        entry.type,
        entry.unit
      )
    );
  }

  return weatherPrediction;
}

function displayHourlyForecast(data) {
  const container = document.getElementById("forecastContainer");
  container.innerHTML = "";

  let groupedData = {};

  data.forEach((entry) => {
    let weatherPrediction = createPredictionObject(entry);
    const formattedTime = formatTime(weatherPrediction.getTime());

    if (!groupedData[formattedTime]) {
      groupedData[formattedTime] = {};
    }

    const typeDataMapping = {
      temperature: `${weatherPrediction.getMin()} to ${weatherPrediction.getMax()} ${weatherPrediction.getUnit()}`,
      precipitation:
        `${weatherPrediction.getMin()} to ${weatherPrediction.getMax()} ${weatherPrediction.getUnit()}` +
        (entry.precipitation_types && entry.precipitation_types.length > 0
          ? ` (${entry.precipitation_types.join(", ")})`
          : ""),
      "wind speed":
        `${weatherPrediction.getMin()} to ${weatherPrediction.getMax()} ${weatherPrediction.getUnit()}` +
        (entry.directions && entry.directions.length > 0
          ? ` (${entry.directions.join(", ")})`
          : ""),
      "cloud coverage": `${weatherPrediction.getMin()} to ${weatherPrediction.getMax()} ${weatherPrediction.getUnit()}`,
    };

    groupedData[formattedTime][weatherPrediction.getType()] =
      typeDataMapping[weatherPrediction.getType()] || "N/A";
  });

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const headerRow = document.createElement("tr");
  [
    "Time",
    "Temperature",
    "Precipitation",
    "Wind Speed",
    "Cloud Coverage",
  ].forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  Object.keys(groupedData).forEach((time) => {
    const row = document.createElement("tr");
    const timeCell = document.createElement("td");
    timeCell.textContent = time;
    row.appendChild(timeCell);

    ["temperature", "precipitation", "wind speed", "cloud coverage"].forEach(
      (key) => {
        const cell = document.createElement("td");
        cell.textContent = groupedData[time][key] || "N/A";
        row.appendChild(cell);
      }
    );

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

function displayLatestMeasurements(data) {
  const container = document.getElementById("latestMeasurementsContainer");
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  let types = ["temperature", "precipitation", "wind speed", "cloud coverage"];
  const table = document.createElement("table");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Type", "Time", "Value"].forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  types.forEach((type) => {
    const latestRaw = data
      .filter((item) => item.type === type)
      .sort((a, b) => new Date(b.time) - new Date(a.time))[0];

    if (latestRaw) {
      let valueDisplay = latestRaw.value
        ? `${latestRaw.value} ${latestRaw.unit}`
        : `${latestRaw.from} - ${latestRaw.to} ${latestRaw.unit}`;

      const formattedTime = formatTime(latestRaw.time);

      const tr = document.createElement("tr");
      [type, formattedTime, valueDisplay].forEach((tdText) => {
        const td = document.createElement("td");
        td.textContent = tdText;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }
  });
  table.appendChild(tbody);

  container.appendChild(table);
}

function displayWeatherStats(data) {
  const container = document.getElementById("weatherStatsContainer");
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const table = document.createElement("table");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Stat", "Time", "Value"].forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  const stats = [
    {
      name: "Minimum Temperature",
      value: Math.min(
        ...data
          .filter((item) => item.type === "temperature")
          .map((item) => item.value)
      ),
      time: formatTime(
        data
          .filter((item) => item.type === "temperature")
          .sort((a, b) => new Date(b.time) - new Date(a.time))[0].time
      ),
    },
    {
      name: "Maximum Temperature",
      value: Math.max(
        ...data
          .filter((item) => item.type === "temperature")
          .map((item) => item.value)
      ),
      time: formatTime(
        data
          .filter((item) => item.type === "temperature")
          .sort((a, b) => new Date(b.time) - new Date(a.time))[0].time
      ),
    },
    {
      name: "Total Precipitation",
      value: data
        .filter((item) => item.type === "precipitation")
        .reduce((sum, item) => sum + item.value, 0),
      time: formatTime(
        data
          .filter((item) => item.type === "precipitation")
          .sort((a, b) => new Date(b.time) - new Date(a.time))[0].time
      ),
    },
    {
      name: "Average Wind Speed",
      value: (
        data
          .filter((item) => item.type === "wind speed")
          .reduce((sum, item) => sum + item.value, 0) /
        data.filter((item) => item.type === "wind speed").length
      ).toFixed(2),
      time: formatTime(
        data
          .filter((item) => item.type === "wind speed")
          .sort((a, b) => new Date(b.time) - new Date(a.time))[0].time
      ),
    },
  ];

  stats.forEach((stat) => {
    const tr = document.createElement("tr");
    [stat.name, stat.time, `${stat.value} ${data[0].unit}`].forEach(
      (tdText) => {
        const td = document.createElement("td");
        td.textContent = tdText;
        tr.appendChild(td);
      }
    );
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

function init() {
  const citySelector = document.getElementById("citySelector");
  const selectedCity = citySelector.value;
  fetchAndUpdateData(selectedCity);

  citySelector.addEventListener("change", function (event) {
    fetchAndUpdateData(event.target.value);
  });
}

function fetchAndUpdateData(city) {
  fetchData("data", city, function (data) {
    displayLatestMeasurements(data);
    displayWeatherStats(data);
  });

  fetchData("forecast", city, displayHourlyForecast);
}
document.addEventListener("DOMContentLoaded", init);
