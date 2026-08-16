"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Globe2,
  UploadCloud,
} from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";

type Source = "file" | "website" | "api";

export default function IngestPage() {
  const [source, setSource] = useState<Source>("file");
  const [websiteUrl, setWebsiteUrl] = useState("");

  return (
    <main>
      <PageHeader
        eyebrow="Data ingestion"
        title="Bring your product data in"
        description="Import manufacturer data from files or websites. ProductIQ will prepare it for AI-powered enrichment."
      />

      {/* Source selector */}

      <div className="grid grid-cols-3 gap-4">
        <SourceCard
          active={source === "file"}
          icon={<FileSpreadsheet size={21} />}
          title="CSV / Excel"
          description="Upload structured product datasets."
          badge="Recommended"
          onClick={() => setSource("file")}
        />

        <SourceCard
          active={source === "website"}
          icon={<Globe2 size={21} />}
          title="Website"
          description="Extract product information from URLs."
          onClick={() => setSource("website")}
        />

        <SourceCard
          active={source === "api"}
          icon={<Globe2 size={21} />}
          title="API"
          description="Connect an external product data source."
          onClick={() => setSource("api")}
        />
      </div>

      {/* File upload */}

      {source === "file" && (
        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-8">
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 p-14 text-center transition hover:border-indigo-300 hover:bg-indigo-50/20">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <UploadCloud size={25} />
            </div>

            <h2 className="mt-5 text-base font-semibold text-gray-900">
              Drop your product dataset here
            </h2>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-gray-400">
              Upload a CSV or Excel file containing manufacturer and product
              information. We&apos;ll automatically analyze the structure.
            </p>

            <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-gray-800">
              Choose file
              <ArrowRight size={14} />
            </button>

            <div className="mt-4 text-[10px] font-medium uppercase tracking-wider text-gray-400">
              CSV • XLSX • XLS
            </div>
          </div>
        </div>
      )}

      {/* Website */}

      {source === "website" && (
        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Globe2 size={20} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Extract from a website
              </h2>

              <p className="mt-1 text-xs leading-5 text-gray-400">
                Enter a product page or manufacturer catalog URL. ProductIQ
                will identify relevant product information automatically.
              </p>
            </div>
          </div>

          <div className="mt-7">
            <label className="mb-2 block text-xs font-medium text-gray-700">
              Website URL
            </label>

            <div className="flex gap-3">
              <input
                value={websiteUrl}
                onChange={(event) => setWebsiteUrl(event.target.value)}
                placeholder="https://manufacturer.com/products/..."
                className="h-11 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 text-xs text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />

              <button
                disabled={!websiteUrl}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-gray-950 px-5 text-xs font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Analyze
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              "Product information",
              "Specifications",
              "Manufacturer details",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 p-3"
              >
                <CheckCircle2
                  size={14}
                  className="text-emerald-500"
                />

                <span className="text-[11px] font-medium text-gray-600">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API */}

      {source === "api" && (
        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-8">
          <div className="rounded-xl bg-gray-50 p-8 text-center">
            <div className="text-sm font-semibold text-gray-900">
              API connectors are coming next
            </div>

            <p className="mt-2 text-xs text-gray-400">
              The ingestion architecture already supports adding external
              product data connectors.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

function SourceCard({
  active,
  icon,
  title,
  description,
  badge,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "relative rounded-2xl border p-5 text-left transition-all duration-200",
        active
          ? "border-indigo-200 bg-indigo-50/50 shadow-sm"
          : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm",
      ].join(" ")}
    >
      {badge && (
        <span className="absolute right-4 top-4 rounded-md bg-indigo-100 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-indigo-600">
          {badge}
        </span>
      )}

      <div
        className={[
          "flex h-10 w-10 items-center justify-center rounded-xl",
          active
            ? "bg-indigo-600 text-white"
            : "bg-gray-50 text-gray-500",
        ].join(" ")}
      >
        {icon}
      </div>

      <div className="mt-5 text-sm font-semibold text-gray-900">
        {title}
      </div>

      <div className="mt-1 max-w-[220px] text-xs leading-5 text-gray-400">
        {description}
      </div>
    </button>
  );
}