import { Suspense } from "react";
import get from "lodash/get";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { match } from "ts-pattern";
import {
    LoadingSpinner,
    useDeskproElements,
    useDeskproAppClient,
    useDeskproAppEvents,
} from "@deskpro/app-sdk";
import {
    Main,
    LinkPage,
    HomePage,
    AdminPage,
    LoginPage,
    ViewIssuePage,
} from "./pages";
import { ErrorFallback } from "./components";
import { useLogout, useUnlinkIssue } from "./hooks";
import type { EventPayload } from "./types";

const App = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { logout } = useLogout();
    const { unlinkIssue } = useUnlinkIssue();

    useDeskproElements(({ registerElement }) => {
        registerElement("refresh", { type: "refresh_button" });
    });

    const debounceElementEvent = useDebouncedCallback<(id: string, type: string, payload: EventPayload) => void>((_, __, payload) => {
        const p = payload as EventPayload;

        match(p.type)
            .with("changePage", () => {
                if (get(p, ["path"])) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    navigate(p.path as string);
                }
            })
            .with("logout", logout)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .with("unlinkIssue", () => unlinkIssue(p.params))
            .otherwise(() => {});
    }, 500);

    useDeskproAppEvents({
        onShow: () => {
            client && setTimeout(() => client.resize(), 200);
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onElementEvent: debounceElementEvent,
    }, [client]);

    if (!client) {
      return (
          <LoadingSpinner/>
      );
    }

    return (
        <Suspense fallback={<LoadingSpinner/>}>
            <QueryErrorResetBoundary>
              {({ reset }) => {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  return (<ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
                          <Routes>
                              <Route path="/admin/callback" element={<AdminPage/>} />
                              <Route path="/login" element={<LoginPage/>} />
                              <Route path="/home" element={<HomePage/>} />
                              <Route path="/link" element={<LinkPage/>} />
                              <Route path="/view-issue" element={<ViewIssuePage/>} />
                              <Route index element={<Main/>} />
                          </Routes>
                      </ErrorBoundary>
                  )
              }}
            </QueryErrorResetBoundary>
            <br/><br/><br/>
        </Suspense>
    );
};

export { App };
