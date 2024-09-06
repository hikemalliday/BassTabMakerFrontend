import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useLogin } from "../requests";
import { AxiosError } from "axios";
import { RenderError } from "./RenderError";
import { useLocalStorageContext } from "../Context/LocalStorageContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const { error, mutateAsync } = useLogin();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { setAuthUser } = useLocalStorageContext();

  const handleInput = (e: React.ChangeEvent, state: string) => {
    const target = e.target as HTMLInputElement;
    if (state === "password") {
      setPassword(target.value);
    } else {
      setUsername(target.value);
    }
  };

  const handleLogin = async () => {
    try {
      const resp = await mutateAsync({ username, password });
      if (resp.status === 200) {
        setAuthUser(resp.data);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      void handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-title">LOGIN</div>
        <TextField
          className="login-input"
          onChange={(e) => handleInput(e, "username")}
          onKeyDown={(e) =>
            handleEnter(e as React.KeyboardEvent<HTMLInputElement>)
          }
          InputProps={{ style: { color: "white" } }}
        />
        <TextField
          className="login-input"
          onChange={(e) => handleInput(e, "password")}
          onKeyDown={(e) =>
            handleEnter(e as React.KeyboardEvent<HTMLInputElement>)
          }
          InputProps={{ style: { color: "white" } }}
          type="password"
        />
        <Button onClick={handleLogin} variant="outlined">
          LOGIN
        </Button>
        <RenderError errorObject={(error as AxiosError) ?? {}} />
      </div>
      <div className="signup-link">
        Don't have an account? Sign up
        <Link to="/signup"> here</Link>
      </div>
    </div>
  );
};
