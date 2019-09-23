const SUPPORT_SESSION_STORAGE =
  typeof Storage !== "undefined" && window.sessionStorage;

export const flatArray = array => array.reduce((a, c) => a.concat(c), []);

export const get12HourFormat = date => {
  let hours = date.getUTCHours();
  let minutes = date.getUTCMinutes();
  let period = hours >= 12 ? "pm" : "am";
  hours = hours > 12 ? hours % 12 : hours === 0 ? 12 : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${minutes} ${period}`;
};

export const getMostFrequest = list => {
  let counts = list.reduce((a, c) => {
    a[c] = (a[c] || 0) + 1;
    return a;
  }, {});

  let maxCount = Math.max(...Object.values(counts));
  let mostFrequent = Object.keys(counts).filter(k => counts[k] === maxCount);

  return mostFrequent && mostFrequent[0];
};

export const kelvinToCelsius = kelvin => (kelvin - 273.15).toFixed(2);

export const kelvinToFahrenheit = kelvin =>
  ((kelvin * 9) / 5 - 459.67).toFixed(2);

export const mpsToKPH = mps => ((mps / 1000) * 3600).toFixed(2);

export const mpsToMPH = mps => (((mps / 1000) * 3600) / 1.609344).toFixed(2);

export const celsius = { unit: "°C", convert: kelvinToCelsius };

export const fahrenheit = { unit: "°F", convert: kelvinToFahrenheit };

export const kph = { unit: "kph", convert: mpsToKPH };

export const mph = { unit: "mph", convert: mpsToMPH };

export const getCachedValue = name => {
  if (SUPPORT_SESSION_STORAGE) {
    const cachedValue = window.sessionStorage.getItem(name);

    if (cachedValue) {
      try {
        return JSON.parse(cachedValue);
      } catch (error) {
        return null;
      }
    }
  } else {
    return null;
  }
};

export const setCachedValue = (name, value) => {
  if (SUPPORT_SESSION_STORAGE) {
    window.sessionStorage.setItem(name, JSON.stringify(value));
  }
};

export const clearCachedValue = name => {
  if (SUPPORT_SESSION_STORAGE) {
    window.sessionStorage.removeItem(name);
  }
};
