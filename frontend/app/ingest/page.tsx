"use client";

import { useState } from "react";

import {
  ArrowRight,
  FileSpreadsheet,
  Globe2,
  UploadCloud,
} from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";

import {
  uploadDataset,
  ingestWebsite,
} from "@/lib/api";

type Source = "file" | "website" | "api";

export default function IngestPage() {
  const [source, setSource] = useState<Source>("file");

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [extracting, setExtracting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleUpload() {
    if (!file) {
      setError("Please select a CSV or Excel file.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const result = await uploadDataset(file);

      setMessage(
        result.message || "Dataset uploaded successfully.",
      );

      setFile(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleWebsiteExtract() {
    if (!websiteUrl.trim()) {
      setError("Please enter a website URL.");
      return;
    }

    try {
      setExtracting(true);
      setError("");
      setMessage("");

      const result = await ingestWebsite(
        websiteUrl.trim(),
      );

      setMessage(
        result.message ||
          "Website product extraction completed.",
      );

      setWebsiteUrl("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Website extraction failed.",
      );
    } finally {
      setExtracting(false);
    }
  }

  function changeSource(nextSource: Source) {
    setSource(nextSource);
    setError("");
    setMessage("");
  }

  return (
    <main>
      <PageHeader
        eyebrow="Data ingestion"
        title="Bring your product data in"
        description="Import manufacturer data from files or websites and prepare it for AI enrichment."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SourceCard
          active={source === "file"}
          icon={<FileSpreadsheet size={21} />}
          title="CSV / Excel"
          description="Upload structured product datasets."
          onClick={() => changeSource("file")}
        />

        <SourceCard
          active={source === "website"}
          icon={<Globe2 size={21} />}
          title="Website"
          description="Extract product information from URLs."
          onClick={() => changeSource("website")}
        />

        <SourceCard
          active={source === "api"}
          icon={<Globe2 size={21} />}
          title="API"
          description="Connect an external product source."
          onClick={() => changeSource("api")}
        />
      </div>

      {source === "file" && (
        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-8">
          <label className="block cursor-pointer rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-14 text-center transition hover:border-indigo-300">
            <UploadCloud
              size={30}
              className="mx-auto text-indigo-500"
            />

            <h2 className="mt-5 text-base font-semibold text-gray-900">
              Choose your product dataset
            </h2>

            <p className="mt-2 text-xs text-gray-400">
              CSV, XLSX or XLS
            </p>

            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(event) => {
                setFile(
                  event.target.files?.[0] || null,
                );
                setError("");
                setMessage("");
              }}
            />

            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-2.5 text-xs font-semibold text-white">
              Select file
              <ArrowRight size={14} />
            </div>
          </label>

          {file && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <div>
                <div className="text-xs font-semibold text-gray-800">
                  {file.name}
                </div>

                <div className="mt-1 text-[10px] text-gray-400">
                  {(file.size / 1024).toFixed(1)} KB
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {uploading
                  ? "Uploading..."
                  : "Import dataset"}
              </button>
            </div>
          )}
        </div>
      )}

      {source === "website" && (
        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-8">
          <div className="mx-auto max-w-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Globe2 size={24} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900">
              Website ingestion
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Enter a manufacturer or product website URL
              and ProductIQ will extract available product
              information.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="url"
                value={websiteUrl}
                onChange={(event) =>
                  setWebsiteUrl(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleWebsiteExtract();
                  }
                }}
                placeholder="https://example.com/product"
                className="h-11 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />

              <button
                onClick={handleWebsiteExtract}
                disabled={extracting}
                className="h-11 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {extracting
                  ? "Extracting..."
                  : "Extract products"}
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-indigo-50 p-4 text-xs leading-5 text-indigo-700">
              AI-ready ingestion: extracted product data
              can be reviewed and enriched through the
              ProductIQ pipeline.
            </div>
          </div>
        </div>
      )}

      {source === "api" && (
        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-8">
          <div className="mx-auto max-w-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Globe2 size={24} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900">
              API connectors
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Connect an external product source to
              automatically bring structured product data
              into ProductIQ.
            </p>

            <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
              <p className="text-sm font-medium text-gray-700">
                API connector configuration
              </p>

              <p className="mt-2 text-xs text-gray-400">
                External API connectors can be configured
                here as the platform expands.
              </p>
            </div>
          </div>
        </div>
      )}

      {(message || error) && (
        <div className="mt-5">
          {message && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
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
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl border p-5 text-left transition",
        active
          ? "border-indigo-200 bg-indigo-50"
          : "border-gray-200 bg-white hover:border-gray-300",
      ].join(" ")}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-indigo-600">
        {icon}
      </div>

      <div className="mt-5 text-sm font-semibold text-gray-900">
        {title}
      </div>

      <div className="mt-1 text-xs leading-5 text-gray-400">
        {description}
      </div>
    </button>
  );
}
