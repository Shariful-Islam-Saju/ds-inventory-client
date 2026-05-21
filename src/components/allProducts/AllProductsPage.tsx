"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { Search, Package, Landmark, ShoppingCart, Layers } from "lucide-react";
import ProductTable from "./ProductTable";
import ProductExcelExport from "./ProductExcelExport";
import ErrorPage from "../shared/Error";

export default function AllProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all products using RTK Query
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetAllProductsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Extract products list
  const products = useMemo(() => response?.data || [], [response]);

  // Filter products based on search query (checks name, code, sku, barcode)
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.item_name?.toLowerCase().includes(query) ||
        p.item_code?.toLowerCase().includes(query) ||
        p.sku?.toLowerCase().includes(query) ||
        p.custom_barcode?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  // Calculate totals on the filtered list for live-updating dashboard feeling
  const { totalStock, totalPurchaseValue, totalSalesValue } = useMemo(() => {
    return filteredProducts.reduce(
      (acc, p) => {
        const stock = p.stock || 0;
        const purchasePrice = p.purchase_price || 0;
        const salesPrice = p.sales_price || 0;

        acc.totalStock += stock;
        acc.totalPurchaseValue += stock * purchasePrice;
        acc.totalSalesValue += stock * salesPrice;

        return acc;
      },
      { totalStock: 0, totalPurchaseValue: 0, totalSalesValue: 0 }
    );
  }, [filteredProducts]);

  return (
    <motion.div
      className="px-4 py-6 mx-auto w-full max-w-7xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
          All Products List
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitor your warehouse inventory, pricing structure, and export product sheets.
        </p>
      </div>

      {/* Top Search & Actions Card */}
      <Card className="mb-6 shadow-md border border-muted rounded-2xl bg-white dark:bg-gray-900">
        <CardContent className="p-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Input Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <Input
              type="text"
              placeholder="Search by Name, SKU, Code or Barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-10 border-gray-200 dark:border-gray-800 focus:border-blue-500 dark:focus:border-blue-800 transition-colors rounded-xl text-sm"
            />
          </div>

          {/* Excel Export Button */}
          <div className="w-full sm:w-auto flex justify-end">
            <ProductExcelExport products={filteredProducts} />
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards Grid */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border border-muted shadow-sm rounded-xl overflow-hidden bg-white dark:bg-gray-900">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Unique Products
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {filteredProducts.length}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-muted shadow-sm rounded-xl overflow-hidden bg-white dark:bg-gray-900">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Stock Units
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {totalStock.toLocaleString()}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-muted shadow-sm rounded-xl overflow-hidden bg-white dark:bg-gray-900">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Inventory Asset Value
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  ৳ {totalPurchaseValue.toLocaleString()}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-muted shadow-sm rounded-xl overflow-hidden bg-white dark:bg-gray-900">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Est. Sales Value
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  ৳ {totalSalesValue.toLocaleString()}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Loading products list...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we construct your inventory reports.
          </p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <ErrorPage
          title="Failed to fetch products"
          message="An error occurred while loading the products database. Please verify your connection and try again."
          onRetry={() => refetch()}
          retryLabel="Retry Loading"
        />
      )}

      {/* Success State */}
      {!isLoading && !isError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ProductTable
            products={filteredProducts}
            totalStock={totalStock}
            totalPurchaseValue={totalPurchaseValue}
            totalSalesValue={totalSalesValue}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
