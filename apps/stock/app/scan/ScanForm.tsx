"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

type ScanFormProps = {
  defaultCode?: string;
};

export default function ScanForm({ defaultCode = "" }: ScanFormProps) {
  const router = useRouter();
  const [code, setCode] = useState(defaultCode);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = code.trim();
    if (trimmed.length === 0) {
      return;
    }
    router.push(`/item/${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="scan-code">Code</label>
      <div>
        <input
          id="scan-code"
          name="code"
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}
