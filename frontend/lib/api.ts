const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        ...(options.body instanceof FormData
          ? {}
          : {
              "Content-Type":
                "application/json",
            }),
        ...(options.headers || {}),
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    let message =
      `Request failed: ${response.status}`;

    try {
      const error = await response.json();

      if (error.detail) {
        message =
          typeof error.detail === "string"
            ? error.detail
            : JSON.stringify(error.detail);
      }
    } catch {}

    throw new Error(message);
  }

  return response.json();
}


export interface Product {
  id: string;

  sku?: string | null;
  manufacturer?: string | null;

  raw_title?: string | null;
  raw_description?: string | null;

  title?: string | null;
  description?: string | null;

  category?: string | null;

  attributes?: Record<
    string,
    unknown
  >;

  quality_score?: number | null;
  confidence_score?: number | null;

  enrichment_status?: string | null;
  review_status?: string | null;

  source?: string | null;

  created_at?: string;
  updated_at?: string;
}


export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  page_size: number;
}


export async function getProducts(
  params?: {
    page?: number;
    page_size?: number;
    search?: string;
  },
): Promise<ProductListResponse> {
  const searchParams =
    new URLSearchParams();

  if (params?.page) {
    searchParams.set(
      "page",
      String(params.page),
    );
  }

  if (params?.page_size) {
    searchParams.set(
      "page_size",
      String(params.page_size),
    );
  }

  if (params?.search) {
    searchParams.set(
      "search",
      params.search,
    );
  }

  const query =
    searchParams.toString();

  return request<ProductListResponse>(
    `/api/products${
      query ? `?${query}` : ""
    }`,
  );
}


export async function getProduct(
  id: string,
): Promise<Product> {
  return request<Product>(
    `/api/products/${id}`,
  );
}


export async function uploadDataset(
  file: File,
) {
  const formData = new FormData();

  formData.append(
    "file",
    file,
  );

  return request(
    "/api/ingestion/upload",
    {
      method: "POST",
      body: formData,
    },
  );
}


export async function enrichProduct(
  id: string,
) {
  return request(
    `/api/enrichment/${id}`,
    {
      method: "POST",
    },
  );
}