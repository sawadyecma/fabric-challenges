import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { Grommet } from "grommet";
import { theme } from "./theme";
import { BrowserRouter, Route, Routes } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Grommet theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Grommet>
  </React.StrictMode>
);
