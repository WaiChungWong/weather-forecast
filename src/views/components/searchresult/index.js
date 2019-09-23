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
        {temperature.convert(tempMax)}
        {temperature.unit}
      </span>{" "}
      <span className="forecast-temp-min">
        {temperature.convert(tempMin)}
        {temperature.unit}
      </span>
    </div>
    <div className="forecast-wind">
      <div className="forecast-wind-speed-title">Wind</div>
      <span className="forecast-wind-speed">
        {windSpeed.convert(wind.speed)}
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
  const offset = forecast
    .filter((e, i) => i < dayIndex)
    .map(({ list }) => list.length)
    .reduce((a, b) => a + b, 0);

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
            {flatArray(forecast.map(({ list }) => list)).map(
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
