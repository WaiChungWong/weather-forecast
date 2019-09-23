import {
  TEMPERATURE_UNIT_CHANGE,
  WIND_SPEED_UNIT_CHANGE
} from "../actiontypes";

import { celsius, kph } from "../utils";

export default (
  state = { temperature: celsius, windSpeed: kph },
  { type, data }
) => {
  switch (type) {
    case TEMPERATURE_UNIT_CHANGE:
      return { temperature: data, windSpeed: state.windSpeed };
    case WIND_SPEED_UNIT_CHANGE:
      return { temperature: state.temperature, windSpeed: data };
    default:
      return state;
  }
};
