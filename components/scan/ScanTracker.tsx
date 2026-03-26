"use client";

import { useEffect } from "react";

export function ScanTracker({ qrId }: { qrId: string }) {
  useEffect(() => {
    const hasScanned = localStorage.getItem(`scanned_${qrId}`);
    if (hasScanned) return;

    const reportScan = async () => {
      try {
        const res = await fetch(`/api/qr/${qrId}/scan`, { method: "POST" });
        if (res.ok) {
          localStorage.setItem(`scanned_${qrId}`, Date.now().toString());
        }
      } catch (e) {
        console.error("Scan reporting failed:", e);
      }
    };

    reportScan();
  }, [qrId]);

  return null;
}
