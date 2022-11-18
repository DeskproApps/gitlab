import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import {
    LoadingSpinner,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { Main } from "./pages/Main";
import { errorFallbackRender } from "./components/Error";

import "flatpickr/dist/themes/light.css";
import "tippy.js/dist/tippy.css";
import "simplebar/dist/simplebar.min.css";

import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";

const App = () => {
    const { client } = useDeskproAppClient();

    if (!client) {
      return (
          <LoadingSpinner/>
      );
    }

    return (
        <Suspense fallback={<LoadingSpinner/>}>
            <QueryErrorResetBoundary>
              {({ reset }) => (
                  <ErrorBoundary onReset={reset} fallbackRender={errorFallbackRender}>
                      <Routes>
                          <Route index element={<Main/>} />
                      </Routes>
                  </ErrorBoundary>
              )}
            </QueryErrorResetBoundary>
        </Suspense>
    );
};

export { App };
