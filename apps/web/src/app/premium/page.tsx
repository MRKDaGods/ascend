"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import PremiumSurvey from "../components/PremiumSurvey";
import PremiumPage from "../components/PremiumPage";

const App: React.FC = () => {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/" && <PremiumSurvey />}
      {pathname === "/premium" && <PremiumPage />}
    </>
  );
};

export default App;