
import React, { useState } from 'react';

const TaskDetail = ({ task }) => {
  const [status, setStatus] = useState(task?.Status);

  const handleStatusChange = async (newStatus) => {
    try {
      await fetch(`/api/tasks/update/${task.Task_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Status: newStatus }),
      });

      setStatus(newStatus);

      if (newStatus === 'Complete') {
        // Gửi thông báo cho admin khi task hoàn thành
        await fetch('/api/notifications/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Task_ID: task.Task_ID,
            Assigned_To: 'admin', // Thay đổi tuỳ theo tên đăng nhập của admin
            Message: `Task ${task.Title} has been completed by ${task.Assigned_To}.`,
          }),
        });
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  return (
    <div>
      <h3>{task.Title}</h3>
      <p>Task Category: {task.Task_Category}</p>
      <p>Description: {task.Description}</p>
      <p>Priority: {task.Priority}</p>
      <p>Due Date: {task.Due_Date}</p>
      <p>Status: {task.Status}</p>
      <p>Assigned To: {task.Assigned_To}</p>
    </div>
  );
};

export default TaskDetail;
