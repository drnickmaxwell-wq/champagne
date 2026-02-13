"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageShell from "../../components/ui/PageShell";
import RoleModeSwitch from "../../components/ui/RoleModeSwitch";
import FeedbackCard from "../../components/ui/FeedbackCard";
import { PrimaryActions } from "../../components/ui/PrimaryActions";
import { ScreenHeader, Section } from "../../components/ui/ScreenKit";
import {
  addLocalSupplier,
  loadLocalSuppliers,
  removeLocalSupplier,
  updateLocalSupplier,
  type LocalSupplier
} from "../../lib/localStores/suppliers";
import { loadRoleMode, type StockRoleMode } from "../../lib/localStores/roleMode";

type SupplierDraft = {
  name: string;
  orderingEmail: string;
  cutoffNotes: string;
  phone: string;
};

const emptyDraft: SupplierDraft = {
  name: "",
  orderingEmail: "",
  cutoffNotes: "",
  phone: ""
};

export default function SetupSuppliersPage() {
  const [role, setRole] = useState<StockRoleMode>("nurse");
  const [suppliers, setSuppliers] = useState<LocalSupplier[]>([]);
  const [draft, setDraft] = useState<SupplierDraft>(emptyDraft);

  useEffect(() => {
    setRole(loadRoleMode());
    setSuppliers(loadLocalSuppliers());
  }, []);

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) {
      return;
    }
    const next = addLocalSupplier({
      name,
      orderingEmail: draft.orderingEmail.trim() || undefined,
      cutoffNotes: draft.cutoffNotes.trim() || undefined,
      phone: draft.phone.trim() || undefined
    });
    setSuppliers(next);
    setDraft(emptyDraft);
  };

  const handleUpdate = (supplier: LocalSupplier, field: keyof SupplierDraft, value: string) => {
    const next = updateLocalSupplier(supplier.id, {
      [field]: value.trim() || undefined,
      name: field === "name" ? value.trim() : supplier.name
    });
    setSuppliers(next);
  };

  if (role !== "admin") {
    return (
      <PageShell
        header={<ScreenHeader eyebrow="Setup" title="Suppliers" actions={<RoleModeSwitch />} />}
      >
        <FeedbackCard title="Admin mode required" message="Switch to Admin mode to edit suppliers." />
        <PrimaryActions>
          <Link href="/setup" className="stock-action-link stock-action-link--secondary">
            Back to setup
          </Link>
        </PrimaryActions>
      </PageShell>
    );
  }

  return (
    <PageShell
      header={
        <ScreenHeader
          eyebrow="Setup"
          title="Suppliers"
          subtitle="Save local supplier contacts for ordering."
          actions={<RoleModeSwitch />}
        />
      }
    >
      <Section title="Add supplier">
        <form className="stock-form" onSubmit={handleSave}>
          <div className="stock-form__row">
            <label>
              Supplier name
              <input
                className="stock-form__input"
                value={draft.name}
                onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
            </label>
            <label>
              Ordering email
              <input
                className="stock-form__input"
                value={draft.orderingEmail}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, orderingEmail: event.target.value }))
                }
              />
            </label>
          </div>
          <div className="stock-form__row">
            <label>
              Cut-off notes
              <input
                className="stock-form__input"
                value={draft.cutoffNotes}
                onChange={(event) => setDraft((prev) => ({ ...prev, cutoffNotes: event.target.value }))}
              />
            </label>
            <label>
              Phone
              <input
                className="stock-form__input"
                value={draft.phone}
                onChange={(event) => setDraft((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </label>
          </div>
          <button type="submit" className="stock-button stock-button--primary stock-form__button">
            Save supplier
          </button>
        </form>
      </Section>

      <Section title="Saved suppliers">
        {suppliers.length === 0 ? <p>No supplier info saved yet.</p> : null}
        <div className="stock-grid">
          {suppliers.map((supplier) => (
            <article key={supplier.id} className="qr-block">
              <p>
                <strong>{supplier.name}</strong>
              </p>
              <label>
                Ordering email
                <input
                  className="stock-form__input"
                  defaultValue={supplier.orderingEmail ?? ""}
                  onBlur={(event) => handleUpdate(supplier, "orderingEmail", event.target.value)}
                />
              </label>
              <label>
                Cut-off notes
                <input
                  className="stock-form__input"
                  defaultValue={supplier.cutoffNotes ?? ""}
                  onBlur={(event) => handleUpdate(supplier, "cutoffNotes", event.target.value)}
                />
              </label>
              <label>
                Phone
                <input
                  className="stock-form__input"
                  defaultValue={supplier.phone ?? ""}
                  onBlur={(event) => handleUpdate(supplier, "phone", event.target.value)}
                />
              </label>
              <div className="qr-actions">
                <button
                  type="button"
                  className="stock-button stock-button--secondary"
                  onClick={() => setSuppliers(removeLocalSupplier(supplier.id))}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </Section>
      <PrimaryActions>
        <Link href="/setup" className="stock-action-link stock-action-link--secondary">
          Back to setup
        </Link>
      </PrimaryActions>
    </PageShell>
  );
}
