"use client";

import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Product {
  id: string;
  sku?: string | null;
  manufacturer?: string | null;
  raw_title?: string | null;
  title?: string | null;
  raw_description?: string | null;
  description?: string | null;
  category?: string | null;
  confidence_score?: number | null;
}

export default function ReviewPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReviews() {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/review/pending`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || "Failed to load reviews."
        );
      }

      setProducts(
        Array.isArray(data.products)
          ? data.products
          : []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load reviews."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <div className="text-sm font-semibold uppercase tracking-widest text-purple-600">
            Quality Control
          </div>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Review Center
          </h1>

          <p className="mt-2 text-slate-600">
            Review AI-enriched products that need human approval.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">
            Products needing review
          </div>

          <div className="mt-2 text-4xl font-bold text-slate-900">
            {products.length}
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            Loading review items...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <div className="text-5xl">✓</div>

            <h2 className="mt-4 text-2xl font-semibold text-slate-900">
              No products need review
            </h2>

            <p className="mt-2 text-slate-500">
              There are currently no low-confidence products
              waiting for human approval.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-xl bg-white p-6 shadow-sm"
              >
                <div className="grid gap-6 lg:grid-cols-3">

                  <div className="lg:col-span-2">
                    <div className="text-sm text-slate-500">
                      SKU: {product.sku || "Not available"}
                    </div>

                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                      {product.title ||
                        product.raw_title ||
                        "Untitled product"}
                    </h2>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">

                      <div className="rounded-lg bg-slate-50 p-4">
                        <div className="text-xs font-semibold uppercase text-slate-500">
                          Manufacturer
                        </div>

                        <div className="mt-1 text-slate-800">
                          {product.manufacturer ||
                            "Not available"}
                        </div>
                      </div>

                      <div className="rounded-lg bg-slate-50 p-4">
                        <div className="text-xs font-semibold uppercase text-slate-500">
                          Category
                        </div>

                        <div className="mt-1 text-slate-800">
                          {product.category ||
                            "Not available"}
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <div className="text-xs font-semibold uppercase text-slate-500">
                          Original title
                        </div>

                        <div className="mt-1 text-sm text-slate-700">
                          {product.raw_title ||
                            "Not available"}
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <div className="text-xs font-semibold uppercase text-slate-500">
                          AI-generated title
                        </div>

                        <div className="mt-1 text-sm font-medium text-slate-900">
                          {product.title ||
                            "Not generated"}
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <div className="text-xs font-semibold uppercase text-slate-500">
                          Original description
                        </div>

                        <div className="mt-1 text-sm text-slate-700">
                          {product.raw_description ||
                            "Not available"}
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <div className="text-xs font-semibold uppercase text-slate-500">
                          AI description
                        </div>

                        <div className="mt-1 text-sm text-slate-900">
                          {product.description ||
                            "Not generated"}
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-6">
                    <div className="text-sm font-semibold text-slate-500">
                      AI CONFIDENCE
                    </div>

                    <div className="mt-3 text-5xl font-bold text-orange-500">
                      {product.confidence_score ?? 0}%
                    </div>

                    <div className="mt-3 text-sm text-slate-500">
                      This product requires human review before
                      approval.
                    </div>

                    <div className="mt-8 space-y-3">
                      <button
                        className="w-full rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                        onClick={() => alert("Approve action will be connected next.")}
                      >
                        Approve
                      </button>

                      <button
                        className="w-full rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
                        onClick={() => alert("Reject action will be connected next.")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}