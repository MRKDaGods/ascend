'use client'; // if using Next.js App Router

import { useRouter } from 'next/navigation';

export function useNotificationRedirect() {
  const router = useRouter();

  const redirectToNotification = (notification: { payload: { link: string } }) => {
    const link = notification.payload.link.startsWith('/')
      ? notification.payload.link
      : `/${notification.payload.link}`;

    router.push(`/notif${link}`);
  };

  return redirectToNotification;
}
