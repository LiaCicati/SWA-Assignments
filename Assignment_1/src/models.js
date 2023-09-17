function Event(time, place) {
  function getTime() {
    return time;
  }
  function getPlace() {
    return place;
  }

  return {
    getTime,
    getPlace,
  };
}

function WeatherData(time, place, value, type, unit) {
  let event = Event(time, place, type);

  function getValue() {
    return value;
  }

  function getType() {
    return type;
  }

  function getUnit() {
    return unit;
  }

  return {
    ...event,
    getValue,
    getType,
    getUnit,
  };
}

function Temperature(time, place, value, type, unit) {
  let weatherData = WeatherData(time, place, value, type, unit);

  function convertToF() {
    if (weatherData.getUnit() === "F") {
      return weatherData.getValue();
    } else {
      return weatherData.getValue() * 1.8 + 32;
    }
  }

  function convertToC() {
    if (weatherData.getUnit() === "C") {
      return weatherData.getValue();
    } else {
      return (weatherData.getValue() - 32) / 1.8;
    }
  }

  return { ...weatherData, convertToF, convertToC };
}

function Precipitation(time, place, value, type, unit) {
  let weatherData = WeatherData(time, place, value, type, unit);

  function getPrecipitationType() {
    return weatherData.getType();
  }

  function convertToInches() {
    if (weatherData.getUnit() === "Inches") {
      return weatherData.getValue();
    } else {
      return weatherData.getValue() / 25.4;
    }
  }

  function convertToMM() {
    if (weatherData.getUnit() === "mm") {
      return weatherData.getValue();
    } else {
      return weatherData.getValue() * 25.4;
    }
  }

  return { ...weatherData, getPrecipitationType, convertToInches, convertToMM };
}

function Wind(time, place, value, type, unit, windDirection) {
  let weatherData = WeatherData(time, place, value, type, unit);

  function getDirection() {
    return windDirection;
  }

  function convertToMPH() {
    if (weatherData.getUnit() === "mph") {
      return weatherData.getValue();
    } else {
      return weatherData.getValue() * 2.23;
    }
  }

  function convertToMS() {
    if (weatherData.getUnit() === "m/s") {
      return weatherData.getValue();
    } else {
      return weatherData.getValue() * 0.44704;
    }
  }
  return { ...weatherData, getDirection, convertToMPH, convertToMS };
}
function CloudCoverage(time, place, value, type, unit) {
  let weatherData = WeatherData(time, place, value, type, unit);

  return { ...weatherData };
}

function WeatherPrediction(time, place, max, min, type, unit) {
  let event = Event(time, place);

  function matches(weatherData) {
    return (
      weatherData.getTime() === time &&
      weatherData.getPlace() === place &&
      weatherData.getType() === type &&
      weatherData.getUnit() === unit &&
      weatherData.getValue() < max &&
      weatherData.getValue() > min
    );
  }
  function getMax() {
    return max;
  }

  function getMin() {
    return min;
  }

  function getType() {
    return type;
  }

  function getUnit() {
    return unit;
  }

  return { ...event, matches, getMax, getMin, getType, getUnit };
}

function TemperaturePrediction(time, place, max, min, type, unit) {
  let weatherPrediction = WeatherPrediction(time, place, max, min, type, unit);

  function convertToF() {
    if (weatherPrediction.getUnit() === "F") {
      return weatherPrediction.getValue();
    } else {
      return weatherPrediction.getValue() * 1.8 + 32;
    }
  }

  function convertToC() {
    if (weatherPrediction.getUnit() === "C") {
      return weatherPrediction.getValue();
    } else {
      return (weatherPrediction.getValue() - 32) / 1.8;
    }
  }

  return { ...weatherPrediction, convertToF, convertToC };
}

function PrecipitationPrediction(
  time,
  place,
  max,
  min,
  type,
  unit,
  expectedTypes
) {
  let weatherPrediction = WeatherPrediction(time, place, max, min, type, unit);

  function getExpectedTypes() {
    return expectedTypes;
  }

  function matches(weatherData) {
    return weatherPrediction.matches(weatherData);
  }

  function convertToInches() {
    if (weatherPrediction.getUnit() === "Inches") {
      return weatherPrediction.getValue();
    } else {
      return weatherPrediction.getValue() / 25.4;
    }
  }

  function convertToMM() {
    if (weatherPrediction.getUnit() === "mm") {
      return weatherPrediction.getValue();
    } else {
      return weatherPrediction.getValue() * 25.4;
    }
  }

  return {
    ...weatherPrediction,
    getExpectedTypes,
    matches,
    convertToInches,
    convertToMM,
  };
}

function WindPrediction(time, place, max, min, type, unit, expectedDirections) {
  let weatherPrediction = WeatherPrediction(time, place, max, min, type, unit);

  function getExpectedDirections() {
    return expectedDirections;
  }

  function matches(weatherData) {
    return weatherPrediction.matches(weatherData);
  }

  function convertToMPH() {
    if (weatherPrediction.getUnit() === "mph") {
      return weatherPrediction.getValue();
    } else {
      return weatherPrediction.getValue() * 2.23;
    }
  }

  function convertToMS() {
    if (weatherPrediction.getUnit() === "m/s") {
      return weatherPrediction.getValue();
    } else {
      return weatherPrediction.getValue() * 0.44704;
    }
  }

  return {
    ...weatherPrediction,
    getExpectedDirections,
    matches,
    convertToMPH,
    convertToMS,
  };
}

function CloudCoveragePrediction(time, place, max, min, type, unit) {
  let weatherPrediction = WeatherPrediction(time, place, max, min, type, unit);
  return { ...weatherPrediction };
}
