import { Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { match } from "ts-pattern";
import {
    LoadingSpinner,
    useDeskproElements,
    useDeskproAppClient,
    useDeskproAppEvents,
} from "@deskpro/app-sdk";
import { Main, LoginPage, HomePage, LinkPage } from "./pages";
import { ErrorFallback } from "./components";
import { useLogout } from "./hooks";
import type { EventPayload } from "./types";

const App = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { logout } = useLogout();

    useDeskproElements(({ registerElement }) => {
        registerElement("refresh", { type: "refresh_button" });
    });

    useDeskproAppEvents({
        onShow: () => {
            client && setTimeout(() => client.resize(), 200);
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onElementEvent: (id, type, payload: EventPayload) => {
            match<EventPayload["type"]>(payload.type)
                .with("changePage", () => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    payload?.path && navigate(payload.path);
                })
                .with("logout", logout)
                .run();
        },
    }, [client]);

    if (!client) {
      return (
          <LoadingSpinner/>
      );
    }

    return (
        <Suspense fallback={<LoadingSpinner/>}>
            <QueryErrorResetBoundary>
              {({ reset }) => (
                  <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
                      <Routes>
                          <Route path="/login" element={<LoginPage/>} />
                          <Route path="/home" element={<HomePage/>} />
                          <Route path="/link" element={<LinkPage/>} />
                          <Route index element={<Main/>} />
                      </Routes>
                  </ErrorBoundary>
              )}
            </QueryErrorResetBoundary>
            <br/><br/><br/>
        </Suspense>
    );
};

export { App };
