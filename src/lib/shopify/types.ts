export type CurrencyCode = "USD" | string;

export type Money = {
  amount: string;
  currencyCode: CurrencyCode;
};

export type ShopifyImage = {
  altText: string | null;
  height: number | null;
  id: string;
  url: string;
  width: number | null;
};

export type Seo = {
  description: string | null;
  title: string | null;
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  availableForSale: boolean;
  compareAtPrice: Money | null;
  currentlyNotInStock: boolean;
  id: string;
  image: ShopifyImage | null;
  price: Money;
  selectedOptions: SelectedOption[];
  sku: string | null;
  title: string;
};

export type Product = {
  availableForSale: boolean;
  compareAtPriceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  description: string;
  descriptionHtml: string;
  featuredImage: ShopifyImage | null;
  handle: string;
  id: string;
  images: ShopifyImage[];
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  productType: string;
  seo: Seo;
  tags: string[];
  title: string;
  updatedAt: string;
  variants: ProductVariant[];
  vendor: string;
};

export type Collection = {
  description: string;
  descriptionHtml: string;
  handle: string;
  id: string;
  image: ShopifyImage | null;
  products: Product[];
  seo: Seo;
  title: string;
  updatedAt: string;
};

export type ShopifyMenuItem = {
  id: string;
  items: ShopifyMenuItem[];
  title: string;
  type: string;
  url: string;
};

export type ShopifyMenu = {
  handle: string;
  id: string;
  items: ShopifyMenuItem[];
  title: string;
};

export type ShopifyPage = {
  body: string;
  bodySummary: string;
  handle: string;
  id: string;
  seo: Seo;
  title: string;
  updatedAt: string;
};

export type ShopifyPolicy = {
  body: string;
  handle: string;
  id: string;
  title: string;
  url: string;
};

export type SearchResult =
  | ({ resultType: "product" } & Product)
  | ({ resultType: "page" } & ShopifyPage)
  | {
      resultType: "article";
      excerpt: string | null;
      handle: string;
      id: string;
      title: string;
      blog: { handle: string };
    };

export type ShopifyGraphqlResponse<T> = {
  data?: T;
  errors?: Array<{
    extensions?: Record<string, unknown>;
    locations?: Array<{ column: number; line: number }>;
    message: string;
    path?: Array<string | number>;
  }>;
};

export type CartLine = {
  cost: {
    amountPerQuantity: Money;
    totalAmount: Money;
  };
  id: string;
  merchandise: {
    availableForSale: boolean;
    id: string;
    image: ShopifyImage | null;
    price: Money;
    product: {
      handle: string;
      title: string;
    };
    selectedOptions: SelectedOption[];
    title: string;
  };
  quantity: number;
};

/** Client-safe cart DTO. The Shopify cart ID and its secret never leave the server. */
export type Cart = {
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
  discountApplications: Array<{
    totalAllocatedAmount: Money;
  }>;
  lines: CartLine[];
  totalQuantity: number;
};

export type CartActionResult = {
  cart: Cart | null;
  message: string;
  ok: boolean;
};

export type CheckoutActionResult = {
  message: string;
  ok: boolean;
  url: string | null;
};
