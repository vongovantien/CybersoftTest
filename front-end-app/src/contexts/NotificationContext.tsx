import React, { createContext, useState, ReactNode, useContext } from "react";
import { Snackbar, Alert } from "@mui/material";

interface Notification {
  message: string;
  severity: "success" | "info" | "warning" | "error";
}

interface NotificationContextType {
  notify: (message: string, severity: Notification["severity"]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<Notification>();

  const notify = (message: string, severity: Notification["severity"]) => {
    setNotification({ message, severity });
  };

  const handleClose = () => {
    //setNotification();
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <Snackbar
        open={notification !== null}
        autoHideDuration={100}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {notification && (
          <Alert
            onClose={handleClose}
            severity={notification.severity}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        )}
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
