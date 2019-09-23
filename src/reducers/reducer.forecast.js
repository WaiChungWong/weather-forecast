import { SEARCH_FOUND, SEARCH_NOT_FOUND, SEARCH_FAILED } from "../actiontypes";

export default (state = [], { type, data }) => {
  switch (type) {
    case SEARCH_FOUND:
      return data.forecast;
    case SEARCH_NOT_FOUND:
    case SEARCH_FAILED:
      return [];
    default:
      return state;
  }
};
