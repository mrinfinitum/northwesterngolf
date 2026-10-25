import type { Metadata } from "next";
import ProductPage, {
  generateMetadata as generateProductMetadata,
} from "@/app/products/[handle]/page";

type NestedProductPageProps = {
  params: Promise<{ handle: string; productHandle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: NestedProductPageProps): Promise<Metadata> {
  const { productHandle } = await params;
  return generateProductMetadata({ params: Promise.resolve({ handle: productHandle }) });
}

export default async function NestedProductPage({ params, searchParams }: NestedProductPageProps) {
  const { productHandle } = await params;
  return ProductPage({ params: Promise.resolve({ handle: productHandle }), searchParams });
}
