"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  Package,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";
import {
  getProducts,
  type Product,
} from "@/lib/api";


export default function ProductsPage() {
  const [
    products,
    setProducts,
  ] = useState<Product[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const result =
          await getProducts({
            page: 1,
            page_size: 50,
          });

        setProducts(
          result.products,
        );

      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load products.",
        );

      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);


  return (
    <main>
      <PageHeader
        eyebrow="Product intelligence"
        title="Products"
        description="Explore standardized product records, AI enrichment results, and data quality."
      />


      <div className="mb-5 grid grid-cols-4 gap-4">

        <SummaryCard
          label="Products"
          value={products.length}
          icon={
            <Package size={17} />
          }
        />

        <SummaryCard
          label="High quality"
          value={
            products.filter(
              (p) =>
                (p.quality_score ?? 0) >=
                90,
            ).length
          }
          icon={
            <CheckCircle2 size={17} />
          }
        />

        <SummaryCard
          label="Needs review"
          value={
            products.filter(
              (p) =>
                p.review_status ===
                "review",
            ).length
          }
          icon={
            <CircleAlert size={17} />
          }
        />

        <SummaryCard
          label="AI enriched"
          value={
            products.filter(
              (p) =>
                p.enrichment_status ===
                "completed",
            ).length
          }
          icon={
            <ArrowUpRight size={17} />
          }
        />

      </div>


      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

        <div className="flex items-center justify-between border-b border-gray-100 p-4">

          <div className="flex h-10 w-[320px] items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3">

            <Search
              size={15}
              className="text-gray-400"
            />

            <input
              placeholder="Search products..."
              className="w-full bg-transparent text-xs outline-none"
            />

          </div>


          <button className="flex h-10 items-center gap-2 rounded-xl border border-gray-200 px-3.5 text-xs font-medium text-gray-600">

            <SlidersHorizontal
              size={14}
            />

            Filters

          </button>

        </div>


        {loading && (
          <div className="p-12 text-center text-sm text-gray-400">
            Loading products...
          </div>
        )}


        {error && !loading && (
          <div className="p-12 text-center">

            <div className="text-sm font-semibold text-red-600">
              Unable to load products
            </div>

            <div className="mt-2 text-xs text-gray-400">
              {error}
            </div>

          </div>
        )}


        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="p-12 text-center">

              <Package
                size={30}
                className="mx-auto text-gray-300"
              />

              <div className="mt-4 text-sm font-semibold text-gray-700">
                No products yet
              </div>

              <div className="mt-1 text-xs text-gray-400">
                Upload a CSV or Excel
                dataset to begin.
              </div>

            </div>
          )}


        {!loading &&
          !error &&
          products.length > 0 && (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-gray-100 bg-gray-50">

                    <Header>
                      Product
                    </Header>

                    <Header>
                      Manufacturer
                    </Header>

                    <Header>
                      Category
                    </Header>

                    <Header>
                      Quality
                    </Header>

                    <Header>
                      AI confidence
                    </Header>

                    <Header>
                      Status
                    </Header>

                  </tr>

                </thead>


                <tbody>

                  {products.map(
                    (product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >

                        <td className="px-5 py-4">

                          <div className="text-sm font-medium text-gray-900">
                            {product.title ||
                              product.raw_title ||
                              "Untitled"}
                          </div>

                          <div className="mt-1 text-[10px] text-gray-400">
                            {product.sku ||
                              product.id}
                          </div>

                        </td>


                        <td className="px-5 py-4 text-xs text-gray-600">
                          {product.manufacturer ||
                            "—"}
                        </td>


                        <td className="px-5 py-4 text-xs text-gray-500">
                          {product.category ||
                            "—"}
                        </td>


                        <td className="px-5 py-4">

                          <Quality
                            value={
                              product.quality_score ??
                              0
                            }
                          />

                        </td>


                        <td className="px-5 py-4 text-xs font-semibold">

                          {product.confidence_score !=
                          null
                            ? `${product.confidence_score}%`
                            : "—"}

                        </td>


                        <td className="px-5 py-4">

                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-600">
                            {product.enrichment_status ||
                              "pending"}
                          </span>

                        </td>

                      </tr>
                    ),
                  )}

                </tbody>

              </table>

            </div>

          )}

      </div>

    </main>
  );
}


function Header({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
      {children}
    </th>
  );
}


function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">

      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
        {icon}
      </div>

      <div className="mt-5 text-2xl font-semibold text-gray-950">
        {value}
      </div>

      <div className="mt-1 text-xs text-gray-400">
        {label}
      </div>

    </div>
  );
}


function Quality({
  value,
}: {
  value: number;
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">

        <div
          className="h-full rounded-full bg-indigo-500"
          style={{
            width: `${Math.min(
              Math.max(value, 0),
              100,
            )}%`,
          }}
        />

      </div>

      <span className="text-xs font-semibold text-gray-700">
        {value
          ? value
          : "—"}
      </span>

    </div>
  );
}
