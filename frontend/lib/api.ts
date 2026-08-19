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
  quality_score?: number | null;
  confidence_score?: number | null;
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