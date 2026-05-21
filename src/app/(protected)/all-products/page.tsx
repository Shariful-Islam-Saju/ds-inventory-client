import AllProductsPage from "@/components/allProducts/AllProductsPage";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "View and manage the full products list in Digital Seba. Search products, check stocks and prices, and export datasets easily.",
};

const Page = () => {
  return <AllProductsPage />;
};

export default Page;
