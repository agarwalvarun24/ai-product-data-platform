"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  Package,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";

const products = [
  {
    id: "PRD-10482",
    name: "3/8 in Brass Coupling",
    manufacturer: "ACME Industrial",
    category: "Pipe Fittings",
    quality: 97,
    confidence: 98,
    status: "Approved",
  },
  {
    id: "PRD-10483",
    name: "1/2 in Stainless Steel Adapter",
    manufacturer: "Northstar Components",
    category: "Adapters",
    quality: 94,
    confidence: 96,
    status: "Approved",
  },
  {
    id: "PRD-10484",
    name: "3/4 in Compression Valve",
    manufacturer: "Atlas Manufacturing",
    category: "Valves",
    quality: 72,
    confidence: 68,
    status: "Review",
  },
  {
    id: "PRD-10485",
    name: "1 in Brass Ball Valve",
    manufacturer: "ACME Industrial",
    category: "Valves",
    quality: 91,
    confidence: 93,
    status: "Approved",
  },
  {
    id: "PRD-10486",
    name: "1/4 in Steel Hex Nipple",
    manufacturer: "Precision Supply",
    category: "Fittings",
    quality: 61,
    confidence: 57,
    status: "Review",
  },
];

export default function ProductsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Product intelligence"
        title="Products"
        description="Explore standardized product records, AI enrichment results, and data quality."
      />

      {/* Summary */}

      <div className="mb-5 grid grid-cols-4 gap-4">
        <SummaryCard
          label="Total products"
          value="12,482"
          icon={<Package size={17} />}
        />

        <SummaryCard
          label="High quality"
          value="9,841"
          icon={<CheckCircle2 size={17} />}
        />

        <SummaryCard
          label="Needs review"
          value="1,248"
          icon={<CircleAlert size={17} />}
        />

        <SummaryCard
          label="AI enriched"
          value="8,921"
          icon={<ArrowUpRight size={17} />}
        />
      </div>

      {/* Product table */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {/* Toolbar */}

        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <div className="flex h-10 w-[320px] items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3">
            <Search size={15} className="text-gray-400" />

            <input
              placeholder="Search products..."
              className="w-full bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>

          <button className="flex h-10 items-center gap-2 rounded-xl border border-gray-200 px-3.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50">
            <SlidersHorizontal size={14} />
            Filters
          </button>
        </div>

        {/* Table */}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Product
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Manufacturer
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Category
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Quality
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  AI confidence
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 transition hover:bg-gray-50/70"
                >
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900">
                      {product.name}
                    </div>

                    <div className="mt-1 text-[10px] text-gray-400">
                      {product.id}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-xs text-gray-600">
                    {product.manufacturer}
                  </td>

                  <td className="px-5 py-4 text-xs text-gray-500">
                    {product.category}
                  </td>

                  <td className="px-5 py-4">
                    <Quality value={product.quality} />
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-xs font-semibold text-gray-700">
                      {product.confidence}%
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <Status status={product.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}

        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
          <span className="text-[11px] text-gray-400">
            Showing 5 of 12,482 products
          </span>

          <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] font-medium text-gray-600 hover:bg-gray-50">
            View all products
          </button>
        </div>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
        {icon}
      </div>

      <div className="mt-5 text-2xl font-semibold tracking-tight text-gray-950">
        {value}
      </div>

      <div className="mt-1 text-xs text-gray-400">{label}</div>
    </div>
  );
}

function Quality({ value }: { value: number }) {
  const good = value >= 90;
  const medium = value >= 75;

  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
        <div
          className={[
            "h-full rounded-full",
            good
              ? "bg-emerald-500"
              : medium
                ? "bg-amber-500"
                : "bg-red-500",
          ].join(" ")}
          style={{ width: `${value}%` }}
        />
      </div>

      <span className="text-xs font-semibold text-gray-700">
        {value}
      </span>
    </div>
  );
}

function Status({ status }: { status: string }) {
  const approved = status === "Approved";

  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold",
        approved
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700",
      ].join(" ")}
    >
      {status}
    </span>
  );
}