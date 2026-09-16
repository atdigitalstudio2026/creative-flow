import React, { createContext, useContext, useState, useEffect } from 'react';
import { NotificationItem } from '../types';
import { taskService } from '../services/taskService';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const refreshNotifications = () => {
    const list = taskService.getNotifications(currentUser.id);
    setNotifications(list);
  };

  useEffect(() => {
    refreshNotifications();
    const interval = setInterval(refreshNotifications, 5000);
    return () => clearInterval(interval);
  }, [currentUser.id]);

  const markAsRead = (id: string) => {
    taskService.markNotificationAsRead(id);
    refreshNotifications();
  };

  const markAllAsRead = () => {
    taskService.markAllNotificationsAsRead(currentUser.id);
    refreshNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refreshNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
