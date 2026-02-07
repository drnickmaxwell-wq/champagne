"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

type ScanFormProps = {
  defaultCode?: string;
  onSubmitCode?: (code: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
};

export default function ScanForm({
  defaultCode = "",
  onSubmitCode,
  disabled = false,
  autoFocus = false
}: ScanFormProps) {
  const router = useRouter();
  const [code, setCode] = useState(defaultCode);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled) {
      return;
    }
    const trimmed = code.trim();
    if (trimmed.length === 0) {
      return;
    }
    const normalized = trimmed.toUpperCase();
    if (onSubmitCode) {
      onSubmitCode(normalized);
      return;
    }
    router.push(`/item/${encodeURIComponent(normalized)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="stock-form">
      <label htmlFor="scan-code">Code</label>
      <div className="stock-form__row">
        <input
          id="scan-code"
          name="code"
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          className="stock-form__input"
          disabled={disabled}
          autoFocus={autoFocus}
        />
        <button
          type="submit"
          className="stock-button stock-button--primary stock-form__button"
          disabled={disabled || code.trim().length === 0}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
