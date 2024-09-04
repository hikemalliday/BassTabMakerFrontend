import "./assets/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainPage } from "./components/MainPage";
import { Dashboard } from "./components/Dashboard";
import { Login } from "./components/Login.tsx";
import { SignUp } from "./components/SignUp.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { SnackbarTest } from "./components/SnackbarTest.tsx";
import { SnackbarComponent } from "./components/SnackbarComponent.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/main" element={<MainPage />} />
          </Route>
          <Route path="/snackbartest" element={<SnackbarTest />} />
        </Routes>
      </BrowserRouter>
      <SnackbarComponent />
    </>
  );
}

export default App;
