"use client";

import Analytics from "@/components/analytics";
import { CacheKey } from "@/services/constant";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import SignModal from "@/components/sign/modal";
import type { ThemeProviderProps } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { cacheGet } from "@/lib/cache";
import { useAppContext } from "@/contexts/app";
import { useEffect } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { theme, setTheme } = useAppContext();

  useEffect(() => {
    const themeInCache = cacheGet(CacheKey.Theme);
    if (themeInCache) {
      // theme setted
      if (["dark", "light"].includes(themeInCache)) {
        setTheme(themeInCache);
        return;
      }
    } else {
      // theme not set
      const defaultTheme = process.env.NEXT_PUBLIC_DEFAULT_THEME;
      if (defaultTheme && ["dark", "light"].includes(defaultTheme)) {
        setTheme(defaultTheme);
        return;
      }
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mediaQuery.matches ? "dark" : "light");

    const handleChange = () => {
      setTheme(mediaQuery.matches ? "dark" : "light");
    };
    mediaQuery.addListener(handleChange);

    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, []);

  return (
    <NextThemesProvider forcedTheme={theme} {...props}>
      {children}

      <Toaster position="top-center" richColors />
      <SignModal />
      <Analytics />
    </NextThemesProvider>
  );
}
