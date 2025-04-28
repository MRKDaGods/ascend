"use client";

import React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import CustomThemeProvider from "./CustomThemeProvider";
import { ApiInitializer } from "@/api";

const cache = createCache({ key: "css", prepend: true });

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider value={cache}>
      <CustomThemeProvider>
        <ApiInitializer content={() => children} />
      </CustomThemeProvider>
    </CacheProvider>
  );
}
