import { combineReducers } from "redux";
import status from "./reducer.status";
import units from "./reducer.units";
import city from "./reducer.city";
import forecast from "./reducer.forecast";

export default combineReducers({
  status,
  units,
  city,
  forecast
});
