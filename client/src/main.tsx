// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./styles/index.css";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store.ts";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "./components/theme-provider.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider defaultTheme="light" storageKey="jookbox-theme">
            <QueryClientProvider client={queryClient}>
                <SnackbarProvider
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "center",
                    }}
                    style={{
                        backgroundColor: "var(--accent)",
                        color: "#fff",
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        borderRadius: "8px",
                    }}
                >
                    <Provider store={store}>
                        <PersistGate loading={null} persistor={persistor}>
                            <App />
                        </PersistGate>
                    </Provider>
                </SnackbarProvider>
            </QueryClientProvider>
        </ThemeProvider>
    </React.StrictMode>
);
