import { useState, useCallback } from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { SnackbarCloseReason } from '@mui/material/Snackbar';

interface NotificationState {
  snackbarOpen: boolean;
  snackbarSeverity: AlertProps['severity'];
  snackbarMessage: string;
}

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    snackbarOpen: false,
    snackbarSeverity: 'success',
    snackbarMessage: '',
  });

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event, 
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setNotification((prev) => ({ ...prev, snackbarOpen: false }));
  };

  const showNotification = useCallback(
    (severity: AlertProps['severity'], message: string) => {
      setNotification({
        snackbarOpen: true,
        snackbarSeverity: severity,
        snackbarMessage: message,
      });
    },
    []
  );

  return { notification, handleCloseSnackbar, showNotification };
};