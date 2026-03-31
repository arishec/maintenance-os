'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  title: string;
  body: string;
  issueId: string | null;
  type: string;
  createdAt: string;
  readAt: string | null;
}

export function NotificationsBell({ dropDirection = 'up' }: { dropDirection?: 'up' | 'down' } = {}) {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchUnreadCount();
    intervalRef.current = setInterval(fetchUnreadCount, 15000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/notifications?countOnly=true');
      if (!response.ok) {
        // Not authenticated or server error — stop polling to avoid log spam
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
      const data = await response.json();
      setUnreadCount(data.count ?? 0);
    } catch {
      // Network error — stop polling
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  const handleBellClick = async () => {
    setIsOpen(!isOpen);

    if (!isOpen) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/notifications');
        const data = await response.json();
        setNotifications(data.notifications || []);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    try {
      await fetch(`/api/notifications/${notification.id}`, {
        method: 'PATCH',
      });

      setNotifications(notifications.map((n) =>
        n.id === notification.id ? { ...n, readAt: new Date().toISOString() } : n
      ));

      fetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }

    // Navigate to the issue if there's an issueId
    setIsOpen(false);
    if (notification.issueId) {
      router.push(`/issues/${notification.issueId}`);
      router.refresh();
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.readAt).map((n) => n.id);

    if (unreadIds.length === 0) return;

    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationIds: unreadIds }),
      });

      setNotifications(notifications.map((n) => ({
        ...n,
        readAt: n.readAt || new Date().toISOString(),
      })));

      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleBellClick}
        className="relative inline-flex items-center justify-center rounded-lg p-2 hover:bg-muted transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-600 text-white text-xs font-semibold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`absolute ${dropDirection === 'up' ? 'bottom-full left-0 mb-2' : 'top-full right-0 mt-2'} w-80 max-w-[calc(100vw-1.5rem)] sm:max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-white shadow-lg z-50`}>
          <div className="border-b border-border px-4 py-3 flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full px-4 py-3 text-left border-b border-border hover:bg-muted transition-colors ${
                    !notification.readAt ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {notification.type === 'contractor_replied' && !notification.readAt && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700 flex-shrink-0">
                            NEW QUOTE
                          </span>
                        )}
                        {notification.type === 'contractor_confirmed' && !notification.readAt && (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 flex-shrink-0">
                            CONFIRMED
                          </span>
                        )}
                        {notification.type === 'contractor_declined' && !notification.readAt && (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 flex-shrink-0">
                            DECLINED
                          </span>
                        )}
                        <span className="font-medium text-sm break-words">
                          {notification.title}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 break-words">
                        {notification.body}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {notification.issueId && (
                          <span className="text-xs text-blue-600">View issue →</span>
                        )}
                      </div>
                    </div>
                    {!notification.readAt && (
                      <div className="mt-1 flex-shrink-0 h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
