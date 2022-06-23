import * as ReactDOM from "react-dom/client";
import * as React from "react";

import App from "./App";

ReactDOM.createRoot(document.querySelector("#app")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
