"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ProductSchema,
  StockClassSchema
} from "@champagne/stock-shared";
import type { Product, StockClass } from "@champagne/stock-shared";
import FeedbackCard from "../components/ui/FeedbackCard";
import { FieldRow } from "../components/ui/FieldList";
import LoadingLine from "../components/ui/LoadingLine";
import PageShell from "../components/ui/PageShell";
import { ActionLink, PrimaryActions } from "../components/ui/PrimaryActions";
import {
  DebugDisclosure,
  KeyValueGrid,
  ScreenHeader,
  Section
} from "../components/ui/ScreenKit";
import DisclosureCard from "../components/ui/DisclosureCard";
import { fetchProducts, patchProduct, postProduct } from "../lib/ops-api";

type ProductDraft = {
  name: string;
  variant: string;
  stockClass: StockClass;
  unitLabel: string;
  packSizeUnits: string;
  minLevelUnits: string;
  maxLevelUnits: string;
  defaultWithdrawUnits: string;
  supplierHint: string;
};

const resolveErrorMessage = (data: unknown) => {
  if (data && typeof data === "object") {
    const candidate = data as Record<string, unknown>;
    if (typeof candidate.message === "string") {
      return candidate.message;
    }
    if (typeof candidate.error === "string") {
      return candidate.error;
    }
  }
  return "Request failed.";
};

const clampNumberInput = (value: string, minimum: number) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return String(minimum);
  }
  return String(Math.max(minimum, parsed));
};

const toDraft = (product: Product): ProductDraft => {
  return {
    name: product.name,
    variant: product.variant ?? "",
    stockClass: product.stockClass,
    unitLabel: product.unitLabel,
    packSizeUnits: String(product.packSizeUnits),
    minLevelUnits: String(product.minLevelUnits),
    maxLevelUnits: String(product.maxLevelUnits),
    defaultWithdrawUnits: String(product.defaultWithdrawUnits),
    supplierHint: product.supplierHint ?? ""
  };
};

const buildPayload = (draft: ProductDraft) => {
  const packSizeUnits = Math.max(1, Number.parseInt(draft.packSizeUnits, 10) || 1);
  const minLevelUnits = Math.max(0, Number.parseInt(draft.minLevelUnits, 10) || 0);
  const maxLevelUnits = Math.max(1, Number.parseInt(draft.maxLevelUnits, 10) || 1);
  const defaultWithdrawUnits = Math.max(
    1,
    Number.parseInt(draft.defaultWithdrawUnits, 10) || 1
  );

  return {
    name: draft.name.trim(),
    variant: draft.variant.trim() ? draft.variant.trim() : null,
    stockClass: draft.stockClass,
    unitLabel: draft.unitLabel.trim(),
    packSizeUnits,
    minLevelUnits,
    maxLevelUnits,
    defaultWithdrawUnits,
    supplierHint: draft.supplierHint.trim() ? draft.supplierHint.trim() : null
  };
};

export default function ProductsPage() {
  const stockClasses = useMemo(() => StockClassSchema.options, []);
  const [products, setProducts] = useState<Product[]>([]);
  const [drafts, setDrafts] = useState<Record<string, ProductDraft>>({});
  const [createDraft, setCreateDraft] = useState<ProductDraft>(() => ({
    name: "",
    variant: "",
    stockClass: stockClasses[0] ?? "CONSUMABLE",
    unitLabel: "unit",
    packSizeUnits: "1",
    minLevelUnits: "0",
    maxLevelUnits: "10",
    defaultWithdrawUnits: "1",
    supplierHint: ""
  }));
  const [loading, setLoading] = useState(false);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [opsUnreachable, setOpsUnreachable] = useState(false);

  const updateDraft = (productId: string, update: Partial<ProductDraft>) => {
    setDrafts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        ...update
      }
    }));
  };

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    setStatusMessage("");
    setOpsUnreachable(false);
    const result = await fetchProducts();
    setLoading(false);
    if (!result.ok) {
      if (result.status === 0) {
        setOpsUnreachable(true);
      }
      setErrorMessage(resolveErrorMessage(result.data));
      setProducts([]);
      return;
    }

    const parsed = ProductSchema.array().safeParse(result.data);
    if (!parsed.success) {
      setErrorMessage("Unexpected products response.");
      setProducts([]);
      return;
    }

    setProducts(parsed.data);
    setDrafts((prev) => {
      const next: Record<string, ProductDraft> = { ...prev };
      parsed.data.forEach((product) => {
        next[product.id] = toDraft(product);
      });
      return next;
    });
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (creating) {
      return;
    }
    setStatusMessage("");
    setErrorMessage("");
    setOpsUnreachable(false);
    const payload = buildPayload(createDraft);
    if (!payload.name || !payload.unitLabel) {
      setErrorMessage("Name and unit label are required.");
      return;
    }

    setCreating(true);
    const result = await postProduct(payload);
    setCreating(false);
    if (!result.ok) {
      if (result.status === 0) {
        setOpsUnreachable(true);
      }
      setErrorMessage(resolveErrorMessage(result.data));
      return;
    }

    setStatusMessage("Product added.");
    setCreateDraft((prev) => ({
      ...prev,
      name: "",
      variant: "",
      supplierHint: ""
    }));
    void loadProducts();
  };

  const handleUpdate = async (productId: string) => {
    if (submittingId) {
      return;
    }
    const draft = drafts[productId];
    if (!draft) {
      return;
    }
    const payload = buildPayload(draft);
    if (!payload.name || !payload.unitLabel) {
      setErrorMessage("Name and unit label are required.");
      return;
    }
    setErrorMessage("");
    setStatusMessage("");
    setOpsUnreachable(false);
    setSubmittingId(productId);
    const result = await patchProduct(productId, payload);
    setSubmittingId(null);
    if (!result.ok) {
      if (result.status === 0) {
        setOpsUnreachable(true);
      }
      setErrorMessage(resolveErrorMessage(result.data));
      return;
    }
    setStatusMessage("Product updated.");
    void loadProducts();
  };

  return (
    <PageShell
      header={
        <ScreenHeader
          title="Products"
          subtitle="Internal staff list for configuring stock items."
        />
      }
    >
      <div className="stock-feedback-region" aria-live="polite">
        {loading ? <LoadingLine label="Working..." /> : null}
        {creating ? <LoadingLine label="Saving product..." /> : null}
        {submittingId ? <LoadingLine label="Updating product..." /> : null}
        {statusMessage ? (
          <FeedbackCard title="Status" role="status" message={statusMessage} />
        ) : null}
        {opsUnreachable ? (
          <FeedbackCard
            title="Ops API unreachable"
            role="alert"
            message="Unable to reach ops-api. Check network or service status."
          />
        ) : null}
        {errorMessage ? (
          <FeedbackCard title="Error" role="alert" message={errorMessage} />
        ) : null}
      </div>

      <Section title="Add product">
        <form className="stock-form" onSubmit={handleCreate}>
          <div className="stock-form__row">
            <label>
              Name
              <input
                className="stock-form__input"
                value={createDraft.name}
                onChange={(event) =>
                  setCreateDraft((prev) => ({
                    ...prev,
                    name: event.target.value
                  }))
                }
                required
              />
            </label>
            <label>
              Variant
              <input
                className="stock-form__input"
                value={createDraft.variant}
                onChange={(event) =>
                  setCreateDraft((prev) => ({
                    ...prev,
                    variant: event.target.value
                  }))
                }
              />
            </label>
          </div>
          <div className="stock-form__row">
            <label>
              Stock class
              <select
                className="stock-form__input"
                value={createDraft.stockClass}
                onChange={(event) =>
                  setCreateDraft((prev) => ({
                    ...prev,
                    stockClass: event.target.value as StockClass
                  }))
                }
              >
                {stockClasses.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Unit label
              <input
                className="stock-form__input"
                value={createDraft.unitLabel}
                onChange={(event) =>
                  setCreateDraft((prev) => ({
                    ...prev,
                    unitLabel: event.target.value
                  }))
                }
                required
              />
            </label>
          </div>
          <div className="stock-form__row">
            <label>
              Pack size
              <input
                className="stock-form__input"
                type="number"
                min="1"
                step="1"
                value={createDraft.packSizeUnits}
                onChange={(event) =>
                  setCreateDraft((prev) => ({
                    ...prev,
                    packSizeUnits: clampNumberInput(event.target.value, 1)
                  }))
                }
              />
            </label>
            <label>
              Min level
              <input
                className="stock-form__input"
                type="number"
                min="0"
                step="1"
                value={createDraft.minLevelUnits}
                onChange={(event) =>
                  setCreateDraft((prev) => ({
                    ...prev,
                    minLevelUnits: clampNumberInput(event.target.value, 0)
                  }))
                }
              />
            </label>
            <label>
              Max level
              <input
                className="stock-form__input"
                type="number"
                min="1"
                step="1"
                value={createDraft.maxLevelUnits}
                onChange={(event) =>
                  setCreateDraft((prev) => ({
                    ...prev,
                    maxLevelUnits: clampNumberInput(event.target.value, 1)
                  }))
                }
              />
            </label>
            <label>
              Default withdraw
              <input
                className="stock-form__input"
                type="number"
                min="1"
                step="1"
                value={createDraft.defaultWithdrawUnits}
                onChange={(event) =>
                  setCreateDraft((prev) => ({
                    ...prev,
                    defaultWithdrawUnits: clampNumberInput(event.target.value, 1)
                  }))
                }
              />
            </label>
          </div>
          <div className="stock-form__row">
            <label>
              Supplier hint
              <input
                className="stock-form__input"
                value={createDraft.supplierHint}
                onChange={(event) =>
                  setCreateDraft((prev) => ({
                    ...prev,
                    supplierHint: event.target.value
                  }))
                }
              />
            </label>
          </div>
          <div className="stock-form__row">
            <button
              type="submit"
              className="stock-button stock-button--primary stock-form__button"
              disabled={creating}
            >
              Add product
            </button>
          </div>
        </form>
      </Section>

      {products.length === 0 && !loading ? (
        <FeedbackCard title="Empty" message="No products configured yet." />
      ) : null}

      {products.map((product) => {
        const draft = drafts[product.id] ?? toDraft(product);
        return (
          <Section
            key={product.id}
            title={product.variant ? `${product.name} (${product.variant})` : product.name}
          >
            <KeyValueGrid>
              <FieldRow label="Stock class" value={product.stockClass} />
              <FieldRow label="Unit label" value={product.unitLabel} />
              <FieldRow label="Pack size" value={product.packSizeUnits} />
              <FieldRow label="Min level" value={product.minLevelUnits} />
              <FieldRow label="Max level" value={product.maxLevelUnits} />
              <FieldRow
                label="Default withdraw"
                value={product.defaultWithdrawUnits}
              />
              <FieldRow label="Supplier" value={product.supplierHint} />
            </KeyValueGrid>
            <DisclosureCard summary="Edit product">
              <form className="stock-form">
                <div className="stock-form__row">
                  <label>
                    Name
                    <input
                      className="stock-form__input"
                      value={draft.name}
                      onChange={(event) =>
                        updateDraft(product.id, { name: event.target.value })
                      }
                      required
                    />
                  </label>
                  <label>
                    Variant
                    <input
                      className="stock-form__input"
                      value={draft.variant}
                      onChange={(event) =>
                        updateDraft(product.id, { variant: event.target.value })
                      }
                    />
                  </label>
                </div>
                <div className="stock-form__row">
                  <label>
                    Stock class
                    <select
                      className="stock-form__input"
                      value={draft.stockClass}
                      onChange={(event) =>
                        updateDraft(product.id, {
                          stockClass: event.target.value as StockClass
                        })
                      }
                    >
                      {stockClasses.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Unit label
                    <input
                      className="stock-form__input"
                      value={draft.unitLabel}
                      onChange={(event) =>
                        updateDraft(product.id, { unitLabel: event.target.value })
                      }
                      required
                    />
                  </label>
                </div>
                <div className="stock-form__row">
                  <label>
                    Pack size
                    <input
                      className="stock-form__input"
                      type="number"
                      min="1"
                      step="1"
                      value={draft.packSizeUnits}
                      onChange={(event) =>
                        updateDraft(product.id, {
                          packSizeUnits: clampNumberInput(event.target.value, 1)
                        })
                      }
                    />
                  </label>
                  <label>
                    Min level
                    <input
                      className="stock-form__input"
                      type="number"
                      min="0"
                      step="1"
                      value={draft.minLevelUnits}
                      onChange={(event) =>
                        updateDraft(product.id, {
                          minLevelUnits: clampNumberInput(event.target.value, 0)
                        })
                      }
                    />
                  </label>
                  <label>
                    Max level
                    <input
                      className="stock-form__input"
                      type="number"
                      min="1"
                      step="1"
                      value={draft.maxLevelUnits}
                      onChange={(event) =>
                        updateDraft(product.id, {
                          maxLevelUnits: clampNumberInput(event.target.value, 1)
                        })
                      }
                    />
                  </label>
                  <label>
                    Default withdraw
                    <input
                      className="stock-form__input"
                      type="number"
                      min="1"
                      step="1"
                      value={draft.defaultWithdrawUnits}
                      onChange={(event) =>
                        updateDraft(product.id, {
                          defaultWithdrawUnits: clampNumberInput(event.target.value, 1)
                        })
                      }
                    />
                  </label>
                </div>
                <div className="stock-form__row">
                  <label>
                    Supplier hint
                    <input
                      className="stock-form__input"
                      value={draft.supplierHint}
                      onChange={(event) =>
                        updateDraft(product.id, {
                          supplierHint: event.target.value
                        })
                      }
                    />
                  </label>
                </div>
                <div className="stock-form__row">
                  <button
                    type="button"
                    className="stock-button stock-button--primary stock-form__button"
                    disabled={submittingId === product.id}
                    onClick={() => handleUpdate(product.id)}
                  >
                    Save changes
                  </button>
                </div>
              </form>
            </DisclosureCard>
          </Section>
        );
      })}

      <PrimaryActions>
        <ActionLink href="/scan">Scan</ActionLink>
        <ActionLink href="/reorder">Reorder</ActionLink>
      </PrimaryActions>

      <DebugDisclosure summary="Technical details (for troubleshooting only)">
        <pre>{JSON.stringify(products, null, 2)}</pre>
      </DebugDisclosure>
    </PageShell>
  );
}
