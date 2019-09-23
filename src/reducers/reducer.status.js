import {
  IDLE,
  LOADING,
  SEARCH_FOUND,
  SEARCH_NOT_FOUND,
  SEARCH_FAILED
} from "../actiontypes";

export default (state = IDLE, { type, data }) => {
  if (
    type === LOADING ||
    type === SEARCH_FOUND ||
    type === SEARCH_NOT_FOUND ||
    type === SEARCH_FAILED
  ) {
    return type;
  } else {
    return state;
  }
};
