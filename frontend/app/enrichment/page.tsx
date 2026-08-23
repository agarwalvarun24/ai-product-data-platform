"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Loader2,
  Sparkles,
  AlertTriangle,
  Brain,
} from "lucide-react";

import {
  enrichProduct,
  getProducts,
  Product,
} from "@/lib/api";

export default function EnrichmentPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] =
    useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoadingProducts(true);

        const data = await getProducts(1, 50);

        setProducts(data.products);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load products.",
        );
      } finally {
        setLoadingProducts(false);
      }
    }

    loadProducts();
  }, []);

  function handleProductChange(id: string) {
    setSelectedId(id);
    setResult(null);
    setError("");

    const product =
      products.find(
        (item) => String(item.id) === id,
      ) || null;

    setSelectedProduct(product);
  }

  async function handleEnrich() {
    if (!selectedId) {
      setError("Please select a product first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await enrichProduct(selectedId);

      setResult(data);

      // Update the selected product locally
      setSelectedProduct((current) =>
        current
          ? {
              ...current,
              title: data.title,
              description: data.description,
              category: data.category,
              attributes: data.attributes,
              confidence_score:
                data.confidence_score,
              enrichment_status: "completed",
            }
          : current,
      );
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

  const confidence =
    typeof result?.confidence_score === "number"
      ? result.confidence_score
      : null;

  const confidenceLabel =
    confidence === null
      ? "Not processed"
      : confidence >= 90
        ? "High confidence"
        : confidence >= 70
          ? "Medium confidence"
          : "Needs review";

  return (
    <main className="min-h-screen bg-[#f8f9fc] px-8 py-10">
      <div className="mx-auto max-w-[1400px]">

        {/* HEADER */}

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
            AI ENRICHMENT
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
            Product enrichment
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Transform raw manufacturer data into
            standardized, searchable product content
            using AI.
          </p>
        </div>

        {/* PIPELINE */}

        <div className="mb-6 grid gap-4 md:grid-cols-3">

          <PipelineCard
            number="01"
            title="Select"
            description="Choose a raw product record"
            active={!selectedProduct}
          />

          <PipelineCard
            number="02"
            title="Enrich"
            description="AI improves product content"
            active={loading}
          />

          <PipelineCard
            number="03"
            title="Validate"
            description="Confidence and quality checks"
            active={!!result}
          />

        </div>

        {/* SELECT PRODUCT */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start justify-between">

            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Sparkles size={18} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    Select product
                  </h2>

                  <p className="text-xs text-slate-400">
                    Choose a product record to enrich
                  </p>
                </div>
              </div>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-medium text-emerald-700">
              AI Ready
            </span>

          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row">

            <div className="relative flex-1">

              <select
                value={selectedId}
                onChange={(event) =>
                  handleProductChange(
                    event.target.value,
                  )
                }
                disabled={loadingProducts || loading}
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
              >
                <option value="">
                  {loadingProducts
                    ? "Loading products..."
                    : "Select a product to enrich"}
                </option>

                {products.map((product) => (
                  <option
                    key={String(product.id)}
                    value={String(product.id)}
                  >
                    {product.raw_title ||
                      product.title ||
                      product.sku ||
                      String(product.id)}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

            </div>

            <button
              onClick={handleEnrich}
              disabled={
                loading ||
                loadingProducts ||
                !selectedId
              }
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  AI processing...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Enrich with AI
                </>
              )}
            </button>

          </div>

          {/* SELECTED RAW DATA */}

          {selectedProduct && !result && (
            <div className="mt-6 grid gap-4 md:grid-cols-3">

              <InfoBox
                label="Manufacturer"
                value={
                  selectedProduct.manufacturer ||
                  "Not available"
                }
              />

              <InfoBox
                label="SKU"
                value={
                  selectedProduct.sku ||
                  "Not available"
                }
              />

              <InfoBox
                label="Current quality"
                value={
                  selectedProduct.quality_score !==
                  undefined
                    ? `${selectedProduct.quality_score}`
                    : "Not scored"
                }
              />

            </div>
          )}

          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <div>
                <div className="font-semibold">
                  Enrichment failed
                </div>

                <div className="mt-1 text-xs">
                  {error}
                </div>
              </div>
            </div>
          )}

        </section>

        {/* RESULT */}

        {result && (
          <section className="mt-6">

            {/* RESULT HEADER */}

            <div className="mb-4 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    Enrichment completed
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    AI-generated content passed the
                    enrichment pipeline.
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-indigo-50 px-5 py-3 text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {confidence ?? 0}%
                  </div>

                  <div className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    AI confidence
                  </div>
                </div>

                <div
                  className={`rounded-xl px-4 py-3 text-center ${
                    confidence !== null &&
                    confidence >= 90
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  <div className="text-xs font-semibold">
                    {confidenceLabel}
                  </div>

                  <div className="mt-1 text-[10px]">
                    Validation status
                  </div>
                </div>

              </div>

            </div>

            {/* BEFORE / AFTER */}

            <div className="grid gap-5 lg:grid-cols-2">

              {/* RAW */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                    <span className="text-xs font-bold text-slate-500">
                      RAW
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Original data
                    </h3>

                    <p className="text-xs text-slate-400">
                      Before AI enrichment
                    </p>
                  </div>

                </div>

                <div className="mt-6 space-y-4">

                  <ResultField
                    label="Title"
                    value={
                      selectedProduct?.raw_title
                    }
                  />

                  <ResultField
                    label="Description"
                    value={
                      selectedProduct?.raw_description
                    }
                  />

                  <ResultField
                    label="Category"
                    value={
                      selectedProduct?.category
                    }
                  />

                </div>

              </div>

              {/* ENRICHED */}

              <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Brain size={16} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      AI enriched data
                    </h3>

                    <p className="text-xs text-slate-400">
                      Standardized product content
                    </p>
                  </div>

                </div>

                <div className="mt-6 space-y-4">

                  <ResultField
                    label="Generated title"
                    value={result.title}
                  />

                  <ResultField
                    label="Description"
                    value={result.description}
                  />

                  <ResultField
                    label="Category"
                    value={result.category}
                  />

                </div>

              </div>

            </div>

            {/* ATTRIBUTES */}

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Extracted attributes
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    Structured technical information
                    generated by AI.
                  </p>
                </div>

                <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-semibold text-indigo-600">
                  STRUCTURED DATA
                </span>

              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">

                {result.attributes &&
                Object.keys(result.attributes)
                  .length > 0 ? (
                  Object.entries(
                    result.attributes,
                  ).map(([key, value]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {key}
                      </div>

                      <div className="mt-2 text-sm font-medium text-slate-800">
                        {String(value)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-400">
                    No structured attributes generated.
                  </div>
                )}

              </div>

            </div>

            {/* VALIDATION */}

            {result.validation_errors?.length >
              0 && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">

                <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                  <AlertTriangle size={17} />
                  Validation issues
                </div>

                <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-amber-700">
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

function PipelineCard({
  number,
  title,
  description,
  active,
}: {
  number: string;
  title: string;
  description: string;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition ${
        active
          ? "border-indigo-200 bg-indigo-50/60"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-3">

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold ${
            active
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {number}
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-900">
            {title}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            {description}
          </div>
        </div>

      </div>
    </div>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </div>

      <div className="mt-2 truncate text-sm font-medium text-slate-800">
        {value}
      </div>
    </div>
  );
}

function ResultField({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </div>

      <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        {value || "Not available"}
      </div>
    </div>
  );
}
