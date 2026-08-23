"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getProducts,
  enrichProductsBulk,
  Product,
} from "@/lib/api";

const PAGE_SIZE = 50;

function getTitle(product: Product) {
  return (
    product.title ||
    product.raw_title ||
    "Untitled product"
  );
}

function getSku(product: Product) {
  return (
    product.sku ||
    product.product_id ||
    String(product.id)
  );
}

function getConfidence(product: Product) {
  if (
    typeof product.confidence_score === "number"
  ) {
    return product.confidence_score;
  }

  if (
    typeof product.quality_score === "number"
  ) {
    return product.quality_score / 100;
  }

  return null;
}

function getStatus(product: Product) {
  if (product.status) {
    return product.status;
  }

  if (product.enrichment_status) {
    return product.enrichment_status;
  }

  if (product.valid === true) {
    return "validated";
  }

  return "pending";
}

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

export default function ProductsPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedIds, setSelectedIds] =
    useState<string[]>([]);

  const [enriching, setEnriching] =
    useState(false);

  const [bulkMessage, setBulkMessage] =
    useState("");

  const [bulkError, setBulkError] =
    useState("");

  // Read search value from the global TopBar.
  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search,
    );

    const urlSearch =
      params.get("search") || "";

    if (urlSearch) {
      setSearchInput(urlSearch);
      setSearch(urlSearch);
      setPage(1);
    }
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const result = await getProducts(
        page,
        PAGE_SIZE,
        search,
      );

      setProducts(result.products);
      setTotal(result.total);

      setSelectedIds([]);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load products.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [page, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(total / PAGE_SIZE),
  );

  const enrichedCount = useMemo(
    () =>
      products.filter(
        (product) =>
          typeof product.confidence_score ===
          "number",
      ).length,
    [products],
  );

  const reviewCount = useMemo(
    () =>
      products.filter((product) => {
        const confidence =
          getConfidence(product);

        return (
          confidence !== null &&
          confidence < 0.7
        );
      }).length,
    [products],
  );

  const allSelected =
    products.length > 0 &&
    products.every((product) =>
      selectedIds.includes(String(product.id)),
    );

  function searchProducts() {
    const value = searchInput.trim();

    setPage(1);
    setSearch(value);

    const url = value
      ? `/products?search=${encodeURIComponent(value)}`
      : "/products";

    window.history.replaceState(
      {},
      "",
      url,
    );
  }

  function clearSearch() {
    setSearchInput("");
    setSearch("");
    setPage(1);

    window.history.replaceState(
      {},
      "",
      "/products",
    );
  }

  function toggleProduct(productId: string) {
    setSelectedIds((current) => {
      if (current.includes(productId)) {
        return current.filter(
          (id) => id !== productId,
        );
      }

      return [...current, productId];
    });

    setBulkMessage("");
    setBulkError("");
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(
        products.map((product) =>
          String(product.id),
        ),
      );
    }

    setBulkMessage("");
    setBulkError("");
  }

  async function handleBulkEnrichment() {
    if (selectedIds.length === 0) {
      return;
    }

    try {
      setEnriching(true);
      setBulkMessage("");
      setBulkError("");

      const result =
        await enrichProductsBulk(
          selectedIds,
        );

      setBulkMessage(
        `AI enrichment completed: ${result.successful} successful, ${result.failed} failed.`,
      );

      setSelectedIds([]);

      await loadProducts();
    } catch (error) {
      console.error(error);

      setBulkError(
        error instanceof Error
          ? error.message
          : "Bulk enrichment failed.",
      );
    } finally {
      setEnriching(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f9fc] px-8 py-10">
      <div className="mx-auto max-w-[1400px]">

        {/* HEADER */}

        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
            Product Intelligence
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
            Products
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Explore standardized product records,
            AI enrichment results, and data quality.
          </p>
        </div>

        {/* METRICS */}

        <div className="mb-6 grid gap-4 md:grid-cols-4">

          <MetricCard
            value={total}
            label="Products"
          />

          <MetricCard
            value={enrichedCount}
            label="AI enriched"
          />

          <MetricCard
            value={reviewCount}
            label="Needs review"
          />

          <MetricCard
            value={
              products.length
                ? `${Math.round(
                    (enrichedCount /
                      products.length) *
                      100,
                  )}%`
                : "0%"
            }
            label="Enrichment coverage"
          />

        </div>

        {/* PRODUCT TABLE */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* SEARCH BAR */}

          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">

            <div className="flex flex-1 gap-3">

              <input
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value,
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    searchProducts();
                  }
                }}
                placeholder="Search products..."
                className="h-11 w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />

              <button
                onClick={searchProducts}
                className="rounded-xl bg-slate-950 px-5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Search
              </button>

              {search && (
                <button
                  onClick={clearSearch}
                  className="rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Clear
                </button>
              )}

            </div>

            {/* BULK ENRICHMENT BUTTON */}

            <div className="flex items-center gap-3">

              {selectedIds.length > 0 && (
                <button
                  onClick={handleBulkEnrichment}
                  disabled={enriching}
                  className="h-11 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {enriching
                    ? "Enriching..."
                    : `Enrich Selected (${selectedIds.length})`}
                </button>
              )}

              <button className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Filters
              </button>

            </div>

          </div>

          {/* ACTIVE SEARCH */}

          {search && (
            <div className="border-b border-slate-200 bg-indigo-50 px-5 py-3 text-xs text-indigo-700">
              Showing results for:
              <span className="ml-1 font-semibold">
                "{search}"
              </span>
            </div>
          )}

          {/* BULK SUCCESS MESSAGE */}

          {bulkMessage && (
            <div className="mx-5 mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {bulkMessage}
            </div>
          )}

          {/* BULK ERROR MESSAGE */}

          {bulkError && (
            <div className="mx-5 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {bulkError}
            </div>
          )}

          {/* NORMAL ERROR */}

          {error && (
            <div className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* LOADING */}

          {loading && (
            <div className="p-12 text-center text-sm text-slate-500">
              Loading products...
            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            products.length === 0 && (
              <div className="p-16 text-center">
                <p className="font-medium text-slate-900">
                  No products found
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {search
                    ? `No products match "${search}".`
                    : "Import a dataset or change your search."}
                </p>
              </div>
            )}

          {/* TABLE */}

          {!loading &&
            products.length > 0 && (
              <div className="overflow-x-auto">

                <table className="w-full min-w-[1050px]">

                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">

                      <th className="w-14 px-5 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={toggleSelectAll}
                          className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Product
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Manufacturer
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Category
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Quality
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        AI Confidence
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {products.map((product) => {
                      const confidence =
                        getConfidence(product);

                      const status =
                        getStatus(product);

                      const productId =
                        String(product.id);

                      const selected =
                        selectedIds.includes(
                          productId,
                        );

                      return (
                        <tr
                          key={productId}
                          className={`border-b border-slate-100 hover:bg-slate-50 ${
                            selected
                              ? "bg-indigo-50"
                              : ""
                          }`}
                        >

                          <td className="px-5 py-5">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() =>
                                toggleProduct(
                                  productId,
                                )
                              }
                              className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </td>

                          <td className="px-5 py-5">
                            <p className="max-w-[320px] truncate text-sm font-semibold text-slate-900">
                              {getTitle(product)}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {getSku(product)}
                            </p>
                          </td>

                          <td className="px-5 py-5 text-sm text-slate-600">
                            {product.manufacturer ||
                              "—"}
                          </td>

                          <td className="px-5 py-5 text-sm text-slate-600">
                            {product.category ||
                              "—"}
                          </td>

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-3">

                              <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">

                                <div
                                  className="h-full rounded-full bg-indigo-500"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      Math.max(
                                        0,
                                        product.quality_score ??
                                          0,
                                      ),
                                    )}%`,
                                  }}
                                />

                              </div>

                              <span className="text-xs text-slate-600">
                                {product.quality_score ??
                                  0}
                              </span>

                            </div>

                          </td>

                          <td className="px-5 py-5">

                            {confidence === null ? (
                              <span className="text-sm text-slate-400">
                                —
                              </span>
                            ) : (
                              <span className="text-sm font-semibold text-slate-700">
                                {Math.round(
                                  confidence *
                                    100,
                                )}
                                %
                              </span>
                            )}

                          </td>

                          <td className="px-5 py-5">

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                              {formatStatus(
                                status,
                              )}
                            </span>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>
            )}

          {/* PAGINATION */}

          {!loading &&
            products.length > 0 && (
              <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">

                <p className="text-sm text-slate-500">
                  Showing{" "}
                  {(page - 1) *
                    PAGE_SIZE +
                    1}
                  –
                  {Math.min(
                    page * PAGE_SIZE,
                    total,
                  )}{" "}
                  of {total} products
                </p>

                <div className="flex items-center gap-2">

                  <button
                    disabled={page === 1}
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.max(
                            1,
                            current - 1,
                          ),
                      )
                    }
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="px-3 text-sm text-slate-600">
                    Page {page} of{" "}
                    {totalPages}
                  </span>

                  <button
                    disabled={
                      page === totalPages
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.min(
                            totalPages,
                            current + 1,
                          ),
                      )
                    }
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:opacity-40"
                  >
                    Next
                  </button>

                </div>

              </div>
            )}

        </section>

      </div>
    </main>
  );
}

function MetricCard({
  value,
  label,
}: {
  value: number | string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {label}
      </p>
    </div>
  );
}
