import * as ReactDOM from "react-dom/client";
import * as React from "react";
import { Auth0Provider } from "@auth0/auth0-react";

import App from "./App";

ReactDOM.createRoot(document.querySelector("#app")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-qkauabonmccg2t1w.us.auth0.com"
      clientId="85otVf9L0H9quZhwhmqt4tVpmY2t3i1T"
      authorizationParams={{
        redirect_uri: window.location.href
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
