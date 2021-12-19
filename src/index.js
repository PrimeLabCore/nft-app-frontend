import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import ReactGA from 'react-ga';

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./store";

ReactGA.initialize('G-VHQDFLX5Y2');
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
reportWebVitals();
