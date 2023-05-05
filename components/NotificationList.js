// components/NotificationList.js
import React, { useState } from 'react';
import useSocket from '../hooks/useSocket';
import TaskDetail from './TaskDetail';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleNewNotification = (notification) => {
    setNotifications((prevNotifications) => [notification, ...prevNotifications]);
  };

  const fetchTaskDetails = async (Task_ID) => {
    try {
      const res = await fetch(`/api/tasks/${Task_ID}`);
      const task = await res.json();
      setSelectedTask(task);
    } catch (error) {
      console.error('Failed to fetch task details:', error);
    }
  };

  const handleNotificationClick = (Task_ID) => {
    fetchTaskDetails(Task_ID);
  };

  useSocket(handleNewNotification);

  return (
    <div>
      <h3>Notifications</h3>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index} onClick={() => handleNotificationClick(notification.Task_ID)}>
            {notification.Message}
          </li>
        ))}
      </ul>
      <TaskDetail task={selectedTask} />
    </div>
  );
};

export default NotificationList;
