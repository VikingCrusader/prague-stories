import { useState } from 'react';

const ASKED_KEY = 'prox-notif-asked';

export function useNotificationPermission() {
  const supported = 'Notification' in window;

  const [permission, setPermission] = useState(
    supported ? Notification.permission : 'unsupported'
  );
  const [asked, setAsked] = useState(() => !!localStorage.getItem(ASKED_KEY));

  const showPrompt = supported && permission === 'default' && !asked;

  const request = async () => {
    localStorage.setItem(ASKED_KEY, '1');
    setAsked(true);
    if (!supported) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const dismiss = () => {
    localStorage.setItem(ASKED_KEY, '1');
    setAsked(true);
  };

  return { permission, showPrompt, request, dismiss };
}
