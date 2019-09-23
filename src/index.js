import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import SearchBar from "./views/components/searchbar";
import SearchResult from "./views/components/searchresult";

import store from "./store";

import "./style.css";

const App = () => (
  <Provider store={store}>
    <SearchBar />
    <SearchResult />
  </Provider>
);

ReactDOM.render(<App />, document.getElementById("root"));
