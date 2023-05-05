// hooks/useSocket.js
import { useEffect } from 'react';
import { io } from 'socket.io-client';

const useSocket = (onNewNotification) => {
  useEffect(() => {
    const socket = io('http://localhost:3000'); // Điều chỉnh địa chỉ server nếu cần

    socket.on('newNotification', (notification) => {
      onNewNotification(notification);
    });

    return () => {
      socket.disconnect();
    };
  }, [onNewNotification]);
};

export default useSocket;
