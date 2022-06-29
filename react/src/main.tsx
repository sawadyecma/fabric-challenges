import React from "react";
import ReactDOM from "react-dom/client";
// import ReactDOM from "react-dom";
import { App } from "./App";
import { Grommet } from "grommet";
import { theme } from "./theme";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Root = () => (
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

const rootElement = document.getElementById("root")!;

ReactDOM.createRoot(rootElement).render(<Root />);
// ReactDOM.render(<Root />, rootElement);
