"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmailRedirect() {
  useRouter();

  useEffect(() => {
    window.location.href = "https://ascend-email-client.vercel.app/";
  }, []);

  return (
    <div>
      <p>Redirecting to email client...</p>
    </div>
  );
}
