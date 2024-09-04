import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useSignUp } from "../requests";
import { AxiosError } from "axios";
import { RenderError } from "../components/RenderError";
import { useLocalStorageContext } from "../Context/LocalStorageContext";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  const navigate = useNavigate();
  const { mutateAsync, error } = useSignUp();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { setTokens } = useLocalStorageContext();

  const handleSignUp = async () => {
    try {
      const resp = await mutateAsync({ username, password });
      if (resp.status === 201) {
        console.log("ACCOUNT CREATED");
        setTokens(resp.data);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInput = (e: React.ChangeEvent, state: string) => {
    const target = e.target as HTMLInputElement;
    if (state === "password") {
      setPassword(target.value);
    } else {
      setUsername(target.value);
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("ENTER FOUND");
      void handleSignUp();
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-title">SIGN UP</div>
        <TextField
          className="signup-input"
          onChange={(e) => handleInput(e, "username")}
          onKeyDown={(e) =>
            handleEnter(e as React.KeyboardEvent<HTMLInputElement>)
          }
          InputProps={{ style: { color: "white" } }}
        />
        <TextField
          className="signup-input"
          onChange={(e) => handleInput(e, "password")}
          onKeyDown={(e) =>
            handleEnter(e as React.KeyboardEvent<HTMLInputElement>)
          }
          InputProps={{ style: { color: "white" } }}
          type="password"
        />
        <Button onClick={handleSignUp} variant="outlined">
          SIGN UP
        </Button>
        <RenderError errorObject={(error as AxiosError) ?? {}} />
      </div>
    </div>
  );
};
