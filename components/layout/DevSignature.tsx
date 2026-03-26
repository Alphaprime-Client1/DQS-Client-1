"use client";

import { useEffect } from "react";
import { devSignature } from "@/lib/signature";

export function DevSignature() {
  useEffect(() => {
    devSignature();
  }, []);

  return (
    <span 
      data-dev="Developer: Santhosh Ravi | Brand: AlphaPrime | Site: alphaprime.co.in" 
      style={{ display: "none" }} 
      aria-hidden="true"
    />
  );
}
