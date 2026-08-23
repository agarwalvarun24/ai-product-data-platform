"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { enrichProduct, getProducts, Product } from "@/lib/api";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();

  const productId = String(params.id);

  const [product, setProduct] = useState<Product | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [enriching, setEnriching] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        /*
         * The existing products API is paginated.
         * We search for this specific product ID by
         * loading the available product records.
         */
        const result = await getProducts(1, 1000);

        const found = result.products.find(
          (item) => String(item.id) === productId,
        );

        if (!found) {
          setError("Product not found.");
          return;
        }

        setProduct(found);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load product.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  async function handleEnrich() {
    if (!product) return;

    try {
      setEnriching(true);
      setError("");
      setMessage("");

      const result = await enrichProduct(
        String(product.id),
      );

      setProduct((current) =>
        current
          ? {
              ...current,
              title: result.title,
              description: result.description,
              category: result.category,
              confidence_score:
                result.confidence_score,
              status:
                result.confidence_score >= 90
                  ? "completed"
                  : "review",
            }
          : current,
      );

      setMessage(
        "Product enriched successfully.",
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Enrichment failed.",
      );
    } finally {
      setEnriching(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f9fc] p-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-slate-500">
            Loading product...
          </p>
        </div>
      </main>
    );
  }

  if (error && !product) {
    return (
      <main className="min-h-screen bg-[#f8f9fc] p-8">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={() => router.push("/products")}
            className="mb-6 text-sm font-medium text-indigo-600"
          >
            ← Back to Products
          </button>

          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return null;
  }

  const confidence =
    typeof product.confidence_score ===
    "number"
      ? product.confidence_score
      : null;

  const status =
    product.status ||
    (confidence !== null
      ? confidence >= 90
        ? "completed"
        : "review"
      : "pending");

  return (
    <main className="min-h-screen bg-[#f8f9fc] px-8 py-10">
      <div className="mx-auto max-w-6xl">

        <button
          onClick={() => router.push("/products")}
          className="mb-6 text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          ← Back to Products
        </button>

        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
            Product Intelligence
          </p>

          <h1 className="text-4xl font-semibold text-slate-950">
            {product.title ||
              product.raw_title ||
              "Untitled Product"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Product ID: {product.id}
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* MAIN INFORMATION */}

          <div className="space-y-6 lg:col-span-2">

            <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">
                  Product Information
                </h2>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                  {status.replaceAll("_", " ")}
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <InfoBox
                  label="SKU"
                  value={
                    product.sku ||
                    product.product_id ||
                    "Not available"
                  }
                />

                <InfoBox
                  label="Manufacturer"
                  value={
                    product.manufacturer ||
                    "Not available"
                  }
                />

                <InfoBox
                  label="Category"
                  value={
                    product.category ||
                    "Not classified"
                  }
                />

                <InfoBox
                  label="Quality Score"
                  value={
                    product.quality_score !==
                    undefined &&
                    product.quality_score !== null
                      ? String(
                          product.quality_score,
                        )
                      : "Not available"
                  }
                />

              </div>
            </section>

            {/* RAW DATA */}

            <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <h2 className="text-xl font-semibold text-slate-900">
                Original Data
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Information received from the uploaded
                dataset.
              </p>

              <div className="mt-5 rounded-xl bg-slate-50 p-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Original Title
                </p>

                <p className="mt-2 text-sm text-slate-700">
                  {product.raw_title ||
                    "No original title available."}
                </p>

              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Original Description
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {product.raw_description ||
                    "No original description available."}
                </p>

              </div>

            </section>

            {/* AI RESULT */}

            <section className="rounded-2xl border border-indigo-100 bg-white p-7 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    AI Enrichment
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Information generated and standardized
                    by AI.
                  </p>
                </div>

                {confidence !== null && (
                  <div className="rounded-xl bg-indigo-50 px-5 py-3 text-center">
                    <p className="text-2xl font-bold text-indigo-600">
                      {Math.round(confidence)}%
                    </p>

                    <p className="text-xs text-indigo-500">
                      Confidence
                    </p>
                  </div>
                )}

              </div>

              <div className="mt-6 space-y-4">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Generated Title
                  </p>

                  <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    {product.title ||
                      "Not enriched yet."}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Generated Category
                  </p>

                  <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    {product.category ||
                      "Not classified yet."}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Generated Description
                  </p>

                  <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    {product.description ||
                      "Not enriched yet."}
                  </div>
                </div>

              </div>

            </section>

          </div>

          {/* SIDE PANEL */}

          <div>

            <section className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <h2 className="text-lg font-semibold text-slate-900">
                AI Actions
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Run AI enrichment on this product to
                generate a standardized title,
                description, category and confidence
                score.
              </p>

              <button
                onClick={handleEnrich}
                disabled={enriching}
                className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {enriching
                  ? "Enriching..."
                  : "✨ Enrich Product"}
              </button>

              <div className="mt-6 border-t border-slate-200 pt-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Workflow
                </p>

                <div className="mt-4 space-y-4">

                  <WorkflowStep
                    number="1"
                    label="Raw product imported"
                    active
                  />

                  <WorkflowStep
                    number="2"
                    label="AI enrichment"
                    active={
                      confidence !== null
                    }
                  />

                  <WorkflowStep
                    number="3"
                    label="Confidence scoring"
                    active={
                      confidence !== null
                    }
                  />

                  <WorkflowStep
                    number="4"
                    label="Human review if needed"
                    active={
                      confidence !== null &&
                      confidence < 90
                    }
                  />

                </div>
              </div>

            </section>

          </div>

        </div>

      </div>
    </main>
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
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
}

function WorkflowStep({
  number,
  label,
  active,
}: {
  number: string;
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-3">

      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
          active
            ? "bg-indigo-600 text-white"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {number}
      </div>

      <p
        className={`text-sm ${
          active
            ? "font-medium text-slate-700"
            : "text-slate-400"
        }`}
      >
        {label}
      </p>

    </div>
  );
}