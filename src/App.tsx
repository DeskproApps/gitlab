import { Suspense } from "react";
import get from "lodash/get";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { match } from "ts-pattern";
import {
    TargetAction,
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
    EditIssuePage,
    CreateIssuePage,
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
            .run();
    }, 500);

    const debounceTargetAction = useDebouncedCallback<(a: TargetAction) => void>(
        (action: TargetAction) => {
            match(action.name)
                .with("linkTicket", () => navigate("/"))
                .run();
        },
        500,
    );

    useDeskproAppEvents({
        onShow: () => {
            client && setTimeout(() => client.resize(), 200);
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onElementEvent: debounceElementEvent,
        onTargetAction: debounceTargetAction,
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
                              <Route path="/create-issue" element={<CreateIssuePage/>} />
                              <Route path="/edit-issue" element={<EditIssuePage/>} />
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
