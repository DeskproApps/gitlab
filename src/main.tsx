import './instrument';
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { QueryClientProvider } from "@tanstack/react-query";
import { DeskproAppProvider } from "@deskpro/app-sdk";
import { Scrollbar } from "@deskpro/deskpro-ui";
import { queryClient } from "./query";
import { App } from "./App";

import "flatpickr/dist/themes/light.css";
import "tippy.js/dist/tippy.css";
import "simplebar/dist/simplebar.min.css";
import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import "./main.css"

TimeAgo.addDefaultLocale(en);

ReactDOM.render((
  <React.StrictMode>
    <Scrollbar style={{ height: "100%", width: "100%" }}>
      <DeskproAppProvider>
        <HashRouter>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </HashRouter>
      </DeskproAppProvider>
    </Scrollbar>
  </React.StrictMode>
), document.getElementById("root"));
