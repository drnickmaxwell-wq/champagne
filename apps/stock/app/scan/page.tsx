"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import ScanForm from "./ScanForm";
import Scanner from "./Scanner";

export default function ScanPage() {
  const router = useRouter();
  const [cameraOpen, setCameraOpen] = useState(false);

  const handleDetected = useCallback(
    (code: string) => {
      setCameraOpen(false);
      router.push(`/item/${encodeURIComponent(code)}`);
    },
    [router]
  );

  const handleStop = useCallback(() => {
    setCameraOpen(false);
  }, []);

  return (
    <section>
      <h1>Scan</h1>
      <ScanForm />
      {cameraOpen ? (
        <Scanner onDetected={handleDetected} onStop={handleStop} />
      ) : (
        <button type="button" onClick={() => setCameraOpen(true)}>
          Use camera
        </button>
      )}
    </section>
  );
}
