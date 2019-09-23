import React, { useState } from "react";
import Classnames from "classnames";
import { connect } from "react-redux";

import { load5DayForecast } from "../../../controllers/controller.forecast";
import { celsius, fahrenheit, kph, mph } from "../../../utils";
import {
  TEMPERATURE_UNIT_CHANGE,
  WIND_SPEED_UNIT_CHANGE
} from "../../../actiontypes";

import "./style.css";

const SearchBar = ({ temperature: t, windSpeed: w, dispatch }) => {
  const [search, setSearch] = useState("");

  const onSubmit = async event => {
    event.preventDefault();

    if (search) {
      await load5DayForecast(encodeURIComponent(search));
    }

    return false;
  };

  return (
    <div>
      <form className="search-bar" onSubmit={event => onSubmit(event)}>
        <input
          type="text"
          placeholder="Your city name"
          onChange={({ target }) => setSearch(target.value.trim())}
        />
        <button type="submit" disabled={search.length === 0}>
          Search
        </button>
      </form>
      <div className="temperature-unit">
        <span
          className={Classnames({ active: celsius.unit === t.unit })}
          onClick={() =>
            dispatch({ type: TEMPERATURE_UNIT_CHANGE, data: celsius })
          }
        >
          {celsius.unit}
        </span>{" "}
        |{" "}
        <span
          className={Classnames({ active: fahrenheit.unit === t.unit })}
          onClick={() =>
            dispatch({ type: TEMPERATURE_UNIT_CHANGE, data: fahrenheit })
          }
        >
          {fahrenheit.unit}
        </span>
      </div>
      <div className="wind-speed-unit">
        <span
          className={Classnames({ active: kph.unit === w.unit })}
          onClick={() => dispatch({ type: WIND_SPEED_UNIT_CHANGE, data: kph })}
        >
          {kph.unit}
        </span>{" "}
        |{" "}
        <span
          className={Classnames({ active: mph.unit === w.unit })}
          onClick={() => dispatch({ type: WIND_SPEED_UNIT_CHANGE, data: mph })}
        >
          {mph.unit}
        </span>
      </div>
    </div>
  );
};

export default connect(({ units }) => units)(SearchBar);
