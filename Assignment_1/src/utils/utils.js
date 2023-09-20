// Utility functions
export function convertToF(value, unit) {
  if (unit === "F") {
    return value;
  } else {
    return value * 1.8 + 32;
  }
}

export function convertToC(value, unit) {
  if (unit === "C") {
    return value;
  } else {
    return (value - 32) / 1.8;
  }
}

export function convertToInches(value, unit) {
  if (unit === "Inches") {
    return value;
  } else {
    return value / 25.4;
  }
}

export function convertToMM(value, unit) {
  if (unit === "mm") {
    return value;
  } else {
    return value * 25.4;
  }
}

export function convertToMPH(value, unit) {
  if (unit === "mph") {
    return value;
  } else {
    return value * 2.23;
  }
}

export function convertToMS(value, unit) {
  if (unit === "m/s") {
    return value;
  } else {
    return value * 0.44704;
  }
}
