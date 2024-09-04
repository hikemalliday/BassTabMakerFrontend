import { Alert, Snackbar } from "@mui/material";
import { useSnackbarContext, ISeverity } from "../Context/SnackBarContext";
import { SyntheticEvent, useEffect } from "react";

interface ITimeAlertProps {
  text: string;
  severity: ISeverity;
  onClose: (event: SyntheticEvent<Element, Event>) => void;
}

const TimedAlert = ({ text, severity, onClose }: ITimeAlertProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => {
      clearTimeout(timer);
    };
  });
  return (
    <Alert onClose={onClose} severity={severity}>
      {text}
    </Alert>
  );
};

export const SnackbarComponent = () => {
  const { toasts, removeToast, clearToasts } = useSnackbarContext();

  const handleClose = (_: unknown, reason: string): void => {
    if (reason === "clickaway") return;
    clearToasts();
  };

  return (
    <Snackbar
      open={toasts.length > 0}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <div>
        {toasts.map(({ id, severity, text }) => {
          return (
            <TimedAlert
              key={id}
              severity={severity}
              text={text}
              onClose={() => {
                removeToast(id);
              }}
            />
          );
        })}
      </div>
    </Snackbar>
  );
};
