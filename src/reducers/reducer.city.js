import { SEARCH_FOUND, SEARCH_NOT_FOUND, SEARCH_FAILED } from "../actiontypes";

export default (state = null, { type, data }) => {
  switch (type) {
    case SEARCH_FOUND:
      return data.city;
    case SEARCH_NOT_FOUND:
    case SEARCH_FAILED:
      return null;
    default:
      return state;
  }
};
