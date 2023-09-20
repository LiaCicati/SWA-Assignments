import {
  convertToF,
  convertToC,
  convertToInches,
  convertToMM,
  convertToMPH,
  convertToMS,
} from "../utils/utils.js";

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
  function getData() {
    return {
      time: this.getTime(),
      place: this.getPlace(),
      value: this.getValue(),
      type: this.getType(),
      unit: this.getUnit(),
    };
  }
  return {
    ...weatherData,
    getData,
    convertToF: () => convertToF(weatherData.getValue(), weatherData.getUnit()),
    convertToC: () => convertToC(weatherData.getValue(), weatherData.getUnit()),
  };
}

function Precipitation(time, place, value, type, unit) {
  let weatherData = WeatherData(time, place, value, type, unit);
  function getData() {
    return {
      time: this.getTime(),
      place: this.getPlace(),
      value: this.getValue(),
      type: this.getType(),
      unit: this.getUnit(),
    };
  }
  function getPrecipitationType() {
    return weatherData.getType();
  }

  return {
    ...weatherData,
    getData,
    getPrecipitationType,
    convertToInches: () =>
      convertToInches(weatherData.getValue(), weatherData.getUnit()),
    convertToMM: () =>
      convertToMM(weatherData.getValue(), weatherData.getUnit()),
  };
}

function Wind(time, place, value, type, unit, windDirection) {
  let weatherData = WeatherData(time, place, value, type, unit);

  function getDirection() {
    return windDirection;
  }
  function getData() {
    return {
      time: this.getTime(),
      place: this.getPlace(),
      value: this.getValue(),
      type: this.getType(),
      unit: this.getUnit(),
      direction: getDirection(),
    };
  }

  return {
    ...weatherData,
    getDirection,
    getData,
    convertToMPH: () =>
      convertToMPH(weatherData.getValue(), weatherData.getUnit()),
    convertToMS: () =>
      convertToMS(weatherData.getValue(), weatherData.getUnit()),
  };
}
function CloudCoverage(time, place, value, type, unit) {
  let weatherData = WeatherData(time, place, value, type, unit);
  function getData() {
    return {
      time: this.getTime(),
      place: this.getPlace(),
      value: this.getValue(),
      type: this.getType(),
      unit: this.getUnit(),
    };
  }

  return { ...weatherData, getData };
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

  return {
    ...weatherPrediction,
    convertToF: () =>
      convertTemperatureToF(
        weatherPrediction.getValue(),
        weatherPrediction.getUnit()
      ),
    convertToC: () =>
      convertTemperatureToC(
        weatherPrediction.getValue(),
        weatherPrediction.getUnit()
      ),
  };
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

  return {
    ...weatherPrediction,
    getExpectedTypes,
    matches,
    convertToInches: () =>
      convertPrecipitationToInches(
        weatherPrediction.getValue(),
        weatherPrediction.getUnit()
      ),
    convertToMM: () =>
      convertPrecipitationToMM(
        weatherPrediction.getValue(),
        weatherPrediction.getUnit()
      ),
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

  return {
    ...weatherPrediction,
    getExpectedDirections,
    matches,
    convertToMPH: () =>
      convertWindToMPH(
        weatherPrediction.getValue(),
        weatherPrediction.getUnit()
      ),
    convertToMS: () =>
      convertWindToMS(
        weatherPrediction.getValue(),
        weatherPrediction.getUnit()
      ),
  };
}

function CloudCoveragePrediction(time, place, max, min, type, unit) {
  let weatherPrediction = WeatherPrediction(time, place, max, min, type, unit);
  return { ...weatherPrediction };
}

export {
  WeatherData,
  WeatherPrediction,
  Temperature,
  Precipitation,
  Wind,
  CloudCoverage,
  TemperaturePrediction,
  PrecipitationPrediction,
  WindPrediction,
  CloudCoveragePrediction,
};
