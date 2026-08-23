"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [threshold, setThreshold] = useState(90);
  const [autoReview, setAutoReview] = useState(true);
  const [saved, setSaved] = useState(false);

  function saveSettings() {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  return (
    <main className="min-h-screen bg-[#f8f9fc] p-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}

        <div className="mb-8">
          <p className="text-sm font-semibold tracking-[0.25em] text-indigo-600">
            WORKSPACE CONFIGURATION
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Settings
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Configure how ProductIQ handles AI enrichment,
            confidence scoring, and human review.
          </p>
        </div>

        {/* AI SETTINGS */}

        <section className="rounded-2xl bg-white p-7 shadow-sm">

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              AI Enrichment
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Control how AI-generated product information
              is reviewed.
            </p>
          </div>

          {/* THRESHOLD */}

          <div className="border-t border-slate-200 py-6">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>
                <p className="font-medium text-slate-900">
                  Review confidence threshold
                </p>

                <p className="mt-1 max-w-xl text-sm text-slate-500">
                  Products with an AI confidence score below
                  this value are sent to the Review Center.
                </p>
              </div>

              <div className="flex items-center gap-3">

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={threshold}
                  onChange={(e) =>
                    setThreshold(
                      Number(e.target.value),
                    )
                  }
                  className="w-24 rounded-lg border border-slate-300 px-4 py-3 text-center font-semibold outline-none focus:border-indigo-500"
                />

                <span className="font-medium text-slate-500">
                  %
                </span>

              </div>

            </div>

            <div className="mt-5">
              <input
                type="range"
                min="0"
                max="100"
                value={threshold}
                onChange={(e) =>
                  setThreshold(
                    Number(e.target.value),
                  )
                }
                className="w-full accent-indigo-600"
              />
            </div>

          </div>

          {/* AUTO REVIEW */}

          <div className="border-t border-slate-200 py-6">

            <div className="flex items-center justify-between gap-6">

              <div>
                <p className="font-medium text-slate-900">
                  Automatic human-review routing
                </p>

                <p className="mt-1 max-w-xl text-sm text-slate-500">
                  Automatically send low-confidence
                  products to the Review Center.
                </p>
              </div>

              <button
                onClick={() =>
                  setAutoReview(!autoReview)
                }
                className={`relative h-7 w-12 rounded-full transition ${
                  autoReview
                    ? "bg-indigo-600"
                    : "bg-slate-300"
                }`}
                aria-label="Toggle automatic review"
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                    autoReview
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>

            </div>

          </div>

        </section>

        {/* SYSTEM STATUS */}

        <section className="mt-6 rounded-2xl bg-white p-7 shadow-sm">

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              System Status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current ProductIQ service configuration.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

            <StatusCard
              title="Backend API"
              status="Connected"
            />

            <StatusCard
              title="AI Enrichment"
              status="Available"
            />

            <StatusCard
              title="Database"
              status="Connected"
            />

          </div>

        </section>

        {/* SAVE */}

        <div className="mt-6 flex items-center justify-end gap-4">

          {saved && (
            <p className="text-sm font-medium text-emerald-600">
              ✓ Settings saved
            </p>
          )}

          <button
            onClick={saveSettings}
            className="rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Save Settings
          </button>

        </div>

        {/* INFO */}

        <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-5">

          <p className="font-semibold text-indigo-900">
            How ProductIQ works
          </p>

          <p className="mt-2 text-sm leading-6 text-indigo-700">
            ProductIQ first normalizes incoming product
            data, then uses AI to generate improved product
            information. Confidence scoring determines
            whether the result can pass automatically or
            requires human verification.
          </p>

        </div>

      </div>
    </main>
  );
}

function StatusCard({
  title,
  status,
}: {
  title: string;
  status: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-5">

      <div className="flex items-center justify-between">

        <p className="text-sm font-medium text-slate-600">
          {title}
        </p>

        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

      </div>

      <p className="mt-3 font-semibold text-emerald-600">
        {status}
      </p>

    </div>
  );
}