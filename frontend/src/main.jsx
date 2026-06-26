import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

import AuthProvider from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { queryClient } from "./lib/queryClient";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e293b",
              color: "#e2e8f0",
              border: "1px solid #334155",
              borderRadius: "12px",
              fontSize: "13px",
              fontFamily: "Inter, sans-serif"
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#e2e8f0" }
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#e2e8f0" }
            }
          }}
        />
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
