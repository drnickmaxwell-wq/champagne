"use client";

import { BrowserMultiFormatReader } from "@zxing/browser";
import { useCallback, useEffect, useRef, useState } from "react";
import type { IScannerControls } from "@zxing/browser";

type ScannerProps = {
  onDetected: (code: string) => void;
  onStop: () => void;
  onUnavailable?: () => void;
};

export default function Scanner({ onDetected, onStop, onUnavailable }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [statusMessage, setStatusMessage] = useState("Initializing camera...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cleanup = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }

    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const handleDetected = useCallback(
    (rawCode: string) => {
      const trimmed = rawCode.trim();
      if (trimmed.length === 0) {
        return;
      }
      cleanup();
      onDetected(trimmed);
    },
    [cleanup, onDetected]
  );

  const startScanner = useCallback(async () => {
    setErrorMessage(null);
    setStatusMessage("Requesting camera access...");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (!videoRef.current) {
        setErrorMessage("Camera preview is unavailable.");
        setStatusMessage("Camera unavailable.");
        cleanup();
        onUnavailable?.();
        return;
      }

      videoRef.current.srcObject = stream;
      await videoRef.current.play().catch(() => undefined);

      if (!readerRef.current) {
        setErrorMessage("Scanner is unavailable.");
        setStatusMessage("Camera unavailable.");
        cleanup();
        onUnavailable?.();
        return;
      }

      controlsRef.current = await readerRef.current.decodeFromStream(
        stream,
        videoRef.current,
        (result) => {
          if (!result) {
            return;
          }
          handleDetected(result.getText());
        }
      );

      setStatusMessage("Point the camera at a QR code or barcode.");
    } catch (error) {
      setErrorMessage("Camera permission was denied or no camera is available.");
      setStatusMessage("Camera unavailable.");
      cleanup();
      onUnavailable?.();
    }
  }, [cleanup, handleDetected, onUnavailable]);

  const handleStop = useCallback(() => {
    cleanup();
    onStop();
  }, [cleanup, onStop]);

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();
    startScanner();

    return () => {
      cleanup();
      readerRef.current = null;
    };
  }, [cleanup, startScanner]);

  return (
    <div>
      <div>
        <video
          ref={videoRef}
          muted
          playsInline
          style={{ width: "100%", maxWidth: "480px" }}
        />
      </div>
      <p>{statusMessage}</p>
      {errorMessage ? <p>{errorMessage}</p> : null}
      <button type="button" onClick={handleStop}>
        Stop camera
      </button>
    </div>
  );
}
