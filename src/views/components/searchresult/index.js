import React, { useState, useEffect } from "react";
import Classnames from "classnames";
import { connect } from "react-redux";

import { flatArray, get12HourFormat } from "../../../utils";

import "./style.css";

import {
  LOADING,
  SEARCH_FOUND,
  SEARCH_NOT_FOUND,
  SEARCH_FAILED
} from "../../../actiontypes";

const SCALE = 20;
const PADDING = 40;

const WeatherDetailComponent = ({
  temperature,
  windSpeed,
  icon,
  condition,
  tempMax,
  tempMin,
  wind
}) => (
  <div>
    <img className="forecast-image" src={icon} alt="condition" />
    <div className="forecast-condition">{condition}</div>
    <div className="forecast-temperature">
      <div className="forecast-temperature-title">Temperature</div>
      <span className="forecast-temp-max">
        {temperature.convert(tempMax).toFixed(1)}
        {temperature.unit}
      </span>{" "}
      <span className="forecast-temp-min">
        {temperature.convert(tempMin).toFixed(1)}
        {temperature.unit}
      </span>
    </div>
    <div className="forecast-wind">
      <div className="forecast-wind-speed-title">Wind</div>
      <span className="forecast-wind-speed">
        {windSpeed.convert(wind.speed).toFixed(1)}
      </span>{" "}
      <span className="forecast-wind-speed-unit">{windSpeed.unit}</span>{" "}
      <span className="forecast-wind-direction">{wind.direction}</span>
    </div>
  </div>
);

const WeatherDetail = connect(({ units }) => units)(WeatherDetailComponent);

const SearchResult = ({ status, units, city, forecast }) => {
  const [dayIndex, setDayIndex] = useState(0);
  const currentDay = (forecast[dayIndex] && forecast[dayIndex].day) || null;
  const hourlyForecast = flatArray(
    forecast.filter((e, i) => i < 5).map(({ list }) => list)
  );
  const overallTempMin =
    Math.min(...hourlyForecast.map(({ tempMin }) => tempMin)) * SCALE;
  const overallTempMax =
    Math.max(...hourlyForecast.map(({ tempMax }) => tempMax)) * SCALE;
  const tempRange = overallTempMax - overallTempMin;
  const offset = forecast
    .filter((e, i) => i < dayIndex)
    .map(({ list }) => list.length)
    .reduce((a, b) => a + b, 0);
  const polyPoints = hourlyForecast
    .map(
      ({ tempMax }, i) =>
        `${50 + 100 * i},${overallTempMin + overallTempMax - tempMax * SCALE}`
    )
    .join(" ");

  useEffect(() => setDayIndex(0), [forecast]);

  switch (status) {
    case SEARCH_FOUND:
      return (
        <div className="forecast">
          <div className="city">
            {city.name}, {city.country}
          </div>
          <div className="five-day-forecast">
            {forecast.map(
              ({ day, icon, condition, tempMax, tempMin, wind }, i) => (
                <div
                  className={Classnames("day-forecast", {
                    active: dayIndex === i
                  })}
                  key={day}
                  onClick={() => setDayIndex(i)}
                >
                  <div className="forecast-title">{day}</div>
                  <WeatherDetail
                    icon={icon}
                    condition={condition}
                    tempMax={tempMax}
                    tempMin={tempMin}
                    wind={wind}
                  />
                </div>
              )
            )}
          </div>
          <div
            className="three-hour-forecast"
            style={{ left: `-${offset * 12.5}%` }}
          >
            {hourlyForecast.map(
              ({ tempMin, tempMax, day, datetime, wind, condition, icon }) => (
                <div
                  className={Classnames("hour-forecast", {
                    active: currentDay === day
                  })}
                  key={datetime}
                >
                  <div className="forecast-title">
                    {get12HourFormat(datetime)}
                  </div>
                  <WeatherDetail
                    icon={icon}
                    condition={condition}
                    tempMax={tempMax}
                    tempMin={tempMin}
                    wind={wind}
                  />
                </div>
              )
            )}
            <svg
              className="three-hour-forecast-graph"
              viewBox={`0 ${overallTempMin - PADDING}
                ${hourlyForecast.length * 100} ${tempRange + PADDING * 2}`}
              width={`${(hourlyForecast.length * 100) / 8}%`}
              height="100%"
              preserveAspectRatio="none"
            >
              <polyline points={polyPoints} />
              <polygon
                points={`50,${overallTempMax + PADDING}
                  ${polyPoints} ${50 + 100 * (hourlyForecast.length - 1)},
                  ${overallTempMax + PADDING}`}
              />
            </svg>
          </div>
        </div>
      );
    case SEARCH_NOT_FOUND:
      return <div className="search-message">City not found</div>;
    case SEARCH_FAILED:
      return <div className="search-message">Search failed</div>;
    case LOADING:
      return <div className="search-loading"></div>;
    default:
      return <div className="search-message">Search a city</div>;
  }
};

export default connect(state => state)(SearchResult);
