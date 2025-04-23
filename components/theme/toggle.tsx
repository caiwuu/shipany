"use client";

import { BsMoonStars, BsSun } from "react-icons/bs";

import { CacheKey } from "@/services/constant";
import { cacheSet } from "@/lib/cache";
import { useAppContext } from "@/contexts/app";

export default function () {
  const { theme, setTheme } = useAppContext();

  const handleThemeChange = function (_theme: string) {
    if (_theme === theme) {
      return;
    }

    cacheSet(CacheKey.Theme, _theme, -1);
    setTheme(_theme);
  };

  return (
    <div className="flex items-center gap-x-2 px-2">
      {theme === "dark" ? (
        <BsSun
          className="cursor-pointer text-lg text-muted-foreground"
          onClick={() => handleThemeChange("light")}
          width={80}
          height={20}
        />
      ) : (
        <BsMoonStars
          className="cursor-pointer text-lg text-muted-foreground"
          onClick={() => handleThemeChange("dark")}
          width={80}
          height={20}
        />
      )}
    </div>
  );
}
