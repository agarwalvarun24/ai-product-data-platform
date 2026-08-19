"use client";

import { useEffect, useState } from "react";
import {
  enrichProduct,
  getProducts,
  Product,
} from "@/lib/api";

export default function EnrichmentPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts(1, 50);
        setProducts(data.products);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load products.",
        );
      }
    }

    loadProducts();
  }, []);

  async function handleEnrich() {
    if (!selectedId) {
      setError("Please select a product.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await enrichProduct(selectedId);
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Enrichment failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f9fc] p-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          AI ENRICHMENT
        </p>

        <h1 className="mt-3 text-4xl font-semibold text-slate-950">
          AI Enrichment
        </h1>

        <p className="mt-2 text-slate-500">
          Improve product titles, descriptions, categories,
          attributes, and confidence automatically.
        </p>

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Select a product
          </h2>

          <div className="mt-4 flex gap-3">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="flex-1 rounded-xl border px-4 py-3 text-sm outline-none"
            >
              <option value="">
                Select a product to enrich
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={String(product.id)}
                >
                  {product.title ||
                    product.raw_title ||
                    product.sku ||
                    String(product.id)}
                </option>
              ))}
            </select>

            <button
              onClick={handleEnrich}
              disabled={loading || !selectedId}
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Enriching..." : "Enrich product"}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}
        </section>

        {result && (
          <section className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Enrichment result
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  AI-generated product information
                </p>
              </div>

              {typeof result.confidence_score === "number" && (
                <div className="rounded-xl bg-indigo-50 px-4 py-3 text-center">
                  <div className="text-2xl font-semibold text-indigo-600">
                    {result.confidence_score}%
                  </div>
                  <div className="text-xs text-slate-500">
                    Confidence
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ResultField
                label="Generated title"
                value={result.title}
              />

              <ResultField
                label="Category"
                value={result.category}
              />

              <ResultField
                label="Description"
                value={result.description}
                wide
              />

              <ResultField
                label="Attributes"
                value={
                  result.attributes
                    ? JSON.stringify(
                        result.attributes,
                        null,
                        2,
                      )
                    : "No attributes generated."
                }
                wide
              />
            </div>

            {result.validation_errors?.length > 0 && (
              <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
                <strong>Validation issues:</strong>
                <ul className="mt-2 list-disc pl-5">
                  {result.validation_errors.map(
                    (item: string) => (
                      <li key={item}>{item}</li>
                    ),
                  )}
                </ul>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

function ResultField({
  label,
  value,
  wide = false,
}: {
  label: string;
  value?: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-2 rounded-xl border bg-slate-50 p-4 text-sm text-slate-700">
        {value || "Not available"}
      </div>
    </div>
  );
}