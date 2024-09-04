import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CellContextProvider } from "./Context/CellContext.tsx";
import { SongContextProvider } from "./Context/SongContext.tsx";
import { LocalStorageProvider } from "./Context/LocalStorageContext.tsx";
import { SnackbarProvider } from "./Context/SnackBarContext.tsx";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <LocalStorageProvider>
      <SongContextProvider>
        <SnackbarProvider>
          <CellContextProvider>
            <App />
          </CellContextProvider>
        </SnackbarProvider>
      </SongContextProvider>
    </LocalStorageProvider>
  </QueryClientProvider>
);
