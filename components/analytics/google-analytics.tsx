"use client";

import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";

export default function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const analyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
  if (!analyticsId) {
    return null;
  }

  return <NextGoogleAnalytics gaId={analyticsId} />;
}
