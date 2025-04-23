"use client";

import { CacheKey } from "@/services/constant";
import { cacheSet } from "@/lib/cache";
import { getTimestamp } from "@/lib/time";
import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function () {
  const params = useParams();
  const code = params.code as string;

  useEffect(() => {
    // expires 30 days
    const expires = 2592000;
    const expiresAt = getTimestamp() + expires;

    cacheSet(CacheKey.InviteCode, code, expiresAt);
    console.log("cache invite code", code, expiresAt);
    window.location.href = "/";
  }, [code]);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      loading...
    </div>
  );
}
