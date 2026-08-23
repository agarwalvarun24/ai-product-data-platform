const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

export interface Product {
  id: string | number;
  sku?: string;
  product_id?: string;

  title?: string;
  raw_title?: string;

  manufacturer?: string;

  category?: string;

  description?: string;
  raw_description?: string;

  attributes?: Record<string, unknown>;

  quality_score?: number | null;
  confidence_score?: number | null;

  enrichment_status?: string;
  review_status?: string;

  status?: string;
  valid?: boolean;

  validation_errors?: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  page_size: number;
  total_pages?: number;
}

export async function getProducts(
  page = 1,
  pageSize = 50,
  search = "",
): Promise<ProductsResponse> {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("page_size", String(pageSize));

  if (search.trim()) {
    params.set("search", search.trim());
  }

  const response = await fetch(
    `${API_URL}/api/products?${params.toString()}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load products (${response.status})`,
    );
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return {
      products: data,
      total: data.length,
      page,
      page_size: pageSize,
      total_pages: Math.ceil(
        data.length / pageSize,
      ),
    };
  }

  return {
    products: Array.isArray(data.products)
      ? data.products
      : [],
    total:
      typeof data.total === "number"
        ? data.total
        : 0,
    page:
      typeof data.page === "number"
        ? data.page
        : page,
    page_size:
      typeof data.page_size === "number"
        ? data.page_size
        : pageSize,
    total_pages:
      typeof data.total_pages === "number"
        ? data.total_pages
        : undefined,
  };
}

export async function uploadDataset(
  file: File,
) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_URL}/api/ingestion/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        `Upload failed (${response.status})`,
    );
  }

  return data;
}

export async function enrichProduct(
  productId: string | number,
) {
  const response = await fetch(
    `${API_URL}/api/enrichment/${productId}`,
    {
      method: "POST",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        `Enrichment failed (${response.status})`,
    );
  }

  return data;
}

export async function enrichProductsBulk(
  productIds: Array<string | number>,
) {
  const response = await fetch(
    `${API_URL}/api/enrichment/bulk`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_ids: productIds.map(String),
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        `Bulk enrichment failed (${response.status})`,
    );
  }

  return data;
}
export interface ReviewProduct {
  id: string;
  sku?: string;
  title?: string;
  raw_title?: string;
  manufacturer?: string;
  category?: string;
  description?: string;
  confidence_score?: number;
  enrichment_status?: string;
  review_status?: string;
}

export async function getPendingReviews() {
  const response = await fetch(
    `${API_URL}/api/review/pending`,
    {
      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        `Failed to load reviews (${response.status})`,
    );
  }

  return data;
}

export async function approveProduct(
  productId: string,
) {
  const response = await fetch(
    `${API_URL}/api/review/${productId}/approve`,
    {
      method: "POST",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        `Approval failed (${response.status})`,
    );
  }

  return data;
}

export async function rejectProduct(
  productId: string,
) {
  const response = await fetch(
    `${API_URL}/api/review/${productId}/reject`,
    {
      method: "POST",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        `Rejection failed (${response.status})`,
    );
  }

  return data;
}
export interface AnalyticsSummary {
  total_products: number;
  ai_enriched: number;
  needs_review: number;
  enrichment_coverage: number;
  average_ai_confidence: number;
  pipeline: {
    imported: number;
    ai_enriched: number;
    needs_review: number;
  };
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const response = await fetch(
    `${API_URL}/api/analytics/summary`,
    {
      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        `Failed to load analytics (${response.status})`,
    );
  }

  return data;
}
export async function ingestWebsite(url: string) {
  const response = await fetch(
    `${API_URL}/api/ingestion/website`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        `Website extraction failed (${response.status})`,
    );
  }

  return data;
}
