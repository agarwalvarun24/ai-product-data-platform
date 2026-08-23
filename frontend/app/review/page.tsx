"use client";

import { useEffect, useState } from "react";
import {
  getPendingReviews,
  approveProduct,
  rejectProduct,
} from "@/lib/api";

interface ReviewProduct {
  id: string;
  sku?: string;
  title?: string;
  raw_title?: string;
  manufacturer?: string;
  category?: string;
  description?: string;
  raw_description?: string;
  confidence_score?: number;
  enrichment_status?: string;
  review_status?: string;
  validation_errors?: string[];
}

export default function ReviewPage() {
  const [products, setProducts] = useState<
    ReviewProduct[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] =
    useState("");

  async function loadReviews() {
    try {
      setLoading(true);
      setError("");

      const data = await getPendingReviews();

      const items =
        Array.isArray(data)
          ? data
          : data.products || [];

      setProducts(items);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load pending reviews.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  async function handleApprove(id: string) {
    try {
      setProcessing(id);
      setError("");

      await approveProduct(id);

      setProducts((current) =>
        current.filter(
          (product) => product.id !== id,
        ),
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to approve product.",
      );
    } finally {
      setProcessing("");
    }
  }

  async function handleReject(id: string) {
    try {
      setProcessing(id);
      setError("");

      await rejectProduct(id);

      setProducts((current) =>
        current.filter(
          (product) => product.id !== id,
        ),
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reject product.",
      );
    } finally {
      setProcessing("");
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f9fc] p-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-8">
          <p className="text-sm font-semibold tracking-[0.25em] text-indigo-600">
            QUALITY CONTROL
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            AI Review Center
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Review lower-confidence AI enrichments
            before product information is approved.
            Human feedback keeps AI-generated data
            trustworthy.
          </p>
        </div>

        {/* SUMMARY */}

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Pending Review
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {products.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Review Threshold
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-500">
              &lt; 90%
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Low-confidence results are routed here
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Human Quality Control
            </p>

            <p className="mt-2 text-3xl font-bold text-indigo-600">
              Active
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Approve or reject AI output
            </p>
          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <p className="text-sm text-slate-500">
              Loading products for review...
            </p>
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          products.length === 0 && (
            <div className="rounded-xl bg-white p-12 text-center shadow-sm">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">
                ✓
              </div>

              <h2 className="mt-5 text-xl font-semibold text-slate-900">
                No products need review
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                All currently flagged products have
                been processed. When AI confidence
                falls below the review threshold,
                products will automatically appear here.
              </p>

            </div>
          )}

        {/* REVIEW CARDS */}

        <div className="space-y-6">

          {products.map((product) => {
            const confidence =
              product.confidence_score ?? 0;

            return (
              <section
                key={product.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >

                {/* CARD HEADER */}

                <div className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">

                  <div>
                    <div className="flex flex-wrap items-center gap-3">

                      <h2 className="text-xl font-semibold text-slate-900">
                        {product.title ||
                          product.raw_title ||
                          "Untitled Product"}
                      </h2>

                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        Needs Review
                      </span>

                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      SKU:{" "}
                      {product.sku || "Not available"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Manufacturer:{" "}
                      {product.manufacturer ||
                        "Unknown"}
                    </p>

                  </div>

                  {/* CONFIDENCE */}

                  <div className="rounded-xl bg-amber-50 px-6 py-4 text-center">

                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                      AI Confidence
                    </p>

                    <p className="mt-1 text-3xl font-bold text-amber-600">
                      {Math.round(confidence)}%
                    </p>

                  </div>

                </div>

                {/* COMPARISON */}

                <div className="grid gap-5 p-6 lg:grid-cols-2">

                  {/* ORIGINAL */}

                  <div className="rounded-xl border border-slate-200">

                    <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Original Dataset
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        What the distributor provided
                      </p>
                    </div>

                    <div className="space-y-5 p-5">

                      <DataField
                        label="Original Title"
                        value={
                          product.raw_title ||
                          "Not available"
                        }
                      />

                      <DataField
                        label="Original Description"
                        value={
                          product.raw_description ||
                          "Not available"
                        }
                      />

                      <DataField
                        label="Category"
                        value={
                          product.category ||
                          "Not classified"
                        }
                      />

                    </div>

                  </div>

                  {/* AI */}

                  <div className="rounded-xl border border-indigo-100">

                    <div className="border-b border-indigo-100 bg-indigo-50 px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                        AI Enrichment
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        What the AI generated
                      </p>
                    </div>

                    <div className="space-y-5 p-5">

                      <DataField
                        label="AI Title"
                        value={
                          product.title ||
                          "Not generated"
                        }
                      />

                      <DataField
                        label="AI Description"
                        value={
                          product.description ||
                          "Not generated"
                        }
                      />

                      <DataField
                        label="Normalized Category"
                        value={
                          product.category ||
                          "Not classified"
                        }
                      />

                    </div>

                  </div>

                </div>

                {/* WHY REVIEW */}

                <div className="mx-6 rounded-xl border border-amber-200 bg-amber-50 p-5">

                  <div className="flex gap-3">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-700">
                      !
                    </div>

                    <div>
                      <p className="font-semibold text-amber-800">
                        Why does this need review?
                      </p>

                      <p className="mt-1 text-sm leading-6 text-amber-700">
                        The AI confidence score is below
                        the 90% approval threshold. A
                        human should verify the generated
                        product information before it is
                        considered approved.
                      </p>

                    </div>

                  </div>

                </div>

                {/* ACTIONS */}

                <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-5 sm:flex-row sm:justify-end">

                  <button
                    onClick={() =>
                      handleReject(product.id)
                    }
                    disabled={
                      processing === product.id
                    }
                    className="rounded-xl border border-red-200 bg-white px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {processing === product.id
                      ? "Processing..."
                      : "Reject AI Result"}
                  </button>

                  <button
                    onClick={() =>
                      handleApprove(product.id)
                    }
                    disabled={
                      processing === product.id
                    }
                    className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {processing === product.id
                      ? "Processing..."
                      : "✓ Approve AI Result"}
                  </button>

                </div>

              </section>
            );
          })}

        </div>

      </div>
    </main>
  );
}

function DataField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-2 rounded-lg bg-slate-50 p-4">
        <p className="text-sm leading-6 text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}