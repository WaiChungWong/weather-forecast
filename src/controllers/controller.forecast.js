import { get } from "axios";

import {
  LOADING,
  SEARCH_FOUND,
  SEARCH_NOT_FOUND,
  SEARCH_FAILED
} from "../actiontypes";
import { dispatch } from "../store";
import {
  getCachedValue,
  setCachedValue,
  clearCachedValue,
  getMostFrequest
} from "../utils";

const API_KEY = "d614b4ae2c96616c63156e819bd878d4";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const WEATHER_ICON_URL = "https://openweathermap.org/img/wn";

const WEEKDAYS = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

const WIND_DIRECTIONS = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW"
];

const getWindDirection = degree => {
  const directionIndex = Math.round((degree / 360) * WIND_DIRECTIONS.length);
  return WIND_DIRECTIONS[directionIndex % WIND_DIRECTIONS.length];
};

const summarizeDayForecast = ({ list, ...rest }) => ({
  tempMin: Math.min(...list.map(({ tempMin }) => tempMin)),
  tempMax: Math.max(...list.map(({ tempMax }) => tempMax)),
  condition: getMostFrequest(list.map(({ condition }) => condition)),
  icon: getMostFrequest(list.map(({ icon }) => icon)).replace("n@2x", "d@2x"),
  wind: {
    direction: getMostFrequest(list.map(({ wind }) => wind.direction)),
    speed: (
      list.map(({ wind }) => wind.speed).reduce((a, b) => a + b) / list.length
    ).toFixed(2)
  },
  list,
  ...rest
});

const getFiveDayForecast = ({ city, list }) => {
  const fiveDayForecast = [];
  let currentDay = null;
  let dayForecast = null;

  for (let i = 0; i < list.length; i++) {
    let { main, weather, wind, dt } = list[i];
    let datetime = new Date((dt + city.timezone) * 1000);
    let day = WEEKDAYS[datetime.getUTCDay()];

    if (currentDay !== day) {
      if (dayForecast) {
        fiveDayForecast.push(summarizeDayForecast(dayForecast));
      }

      currentDay = day;
      dayForecast = { day, list: [] };
    }

    dayForecast.list.push({
      day,
      datetime,
      tempMin: main.temp_min,
      tempMax: main.temp_max,
      condition: weather[0].main,
      icon: `${WEATHER_ICON_URL}/${weather[0].icon}@2x.png`,
      wind: {
        direction: getWindDirection(wind.deg),
        speed: wind.speed
      }
    });
  }

  if (dayForecast) {
    fiveDayForecast.push(summarizeDayForecast(dayForecast));
  }

  return { city, forecast: fiveDayForecast };
};

export const load5DayForecast = async search => {
  dispatch({ type: LOADING });

  const cachedValue = getCachedValue(search);

  if (cachedValue) {
    const { expiry, ...rest } = cachedValue;

    if (expiry <= new Date().getTime()) {
      clearCachedValue(search);
    } else {
      dispatch({ type: SEARCH_FOUND, data: getFiveDayForecast(rest) });
      return;
    }
  }

  try {
    const { data } = await get(`${FORECAST_URL}?q=${search}&APPID=${API_KEY}`);

    var expiry = new Date();
    expiry.setHours(expiry.getHours() + Math.ceil(expiry.getMinutes() / 60));
    expiry.setMinutes(0);
    expiry.setSeconds(0);

    setCachedValue(search, { ...data, expiry: expiry.getTime() });
    dispatch({ type: SEARCH_FOUND, data: getFiveDayForecast(data) });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      dispatch({ type: SEARCH_NOT_FOUND });
    } else {
      dispatch({ type: SEARCH_FAILED, data: error });
    }
  }
};
