"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { TProduct } from "@/types";

type PropsType = {
  products: TProduct[];
  totalStock: number;
  totalPurchaseValue: number;
  totalSalesValue: number;
};

export default function ProductTable({
  products,
  totalStock,
  totalPurchaseValue,
  totalSalesValue,
}: PropsType) {
  return (
    <Card className="p-4 border shadow-sm rounded-2xl bg-white dark:bg-gray-900">
      <ScrollArea className="h-[60vh]">
        <div className="min-w-full overflow-x-auto relative h-[60vh]">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-blue-800 text-white uppercase text-[13px] md:text-[14px]">
              <tr>
                <th className="px-3 py-3 sticky top-0 bg-blue-800 z-10 w-12 text-center">#</th>
                <th className="px-4 py-3 sticky top-0 bg-blue-800 z-10 text-left min-w-[180px]">
                  Product Name
                </th>
                <th className="px-3 py-3 sticky top-0 bg-blue-800 z-10 text-center">
                  Item Code
                </th>
                <th className="px-3 py-3 sticky top-0 bg-blue-800 z-10 text-center">
                  SKU
                </th>
                <th className="px-3 py-3 sticky top-0 bg-blue-800 z-10 text-center">
                  Custom Barcode
                </th>
                <th className="px-3 py-3 sticky top-0 bg-blue-800 z-10 text-right">
                  Purchase Price
                </th>
                <th className="px-3 py-3 sticky top-0 bg-blue-800 z-10 text-right">
                  Sales Price
                </th>
                <th className="px-3 py-3 sticky top-0 bg-blue-800 z-10 text-center">
                  Stock
                </th>
                <th className="px-3 py-3 sticky top-0 bg-blue-800 z-10 text-right">
                  Total Asset
                </th>
                <th className="px-3 py-3 sticky top-0 bg-blue-800 z-10 text-center">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-10 text-muted-foreground bg-gray-50 dark:bg-gray-800/50 rounded-b-xl"
                  >
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                <>
                  {products.map((product, idx) => {
                    const totalAsset = (product.stock || 0) * (product.purchase_price || 0);
                    const isActive = product.status === 1;

                    return (
                      <tr
                        key={product.id}
                        className={`border-t border-gray-100 dark:border-gray-800 ${
                          idx % 2 === 0
                            ? "bg-white dark:bg-gray-900"
                            : "bg-gray-50 dark:bg-gray-800/40"
                        } hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors`}
                      >
                        <td className="px-3 py-2.5 text-center text-gray-500 font-medium">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-gray-800 dark:text-gray-200 break-words max-w-[220px]">
                          {product.item_name ?? "Unnamed Product"}
                        </td>
                        <td className="px-3 py-2.5 text-center text-gray-600 dark:text-gray-400 font-mono text-xs">
                          {product.item_code ?? "-"}
                        </td>
                        <td className="px-3 py-2.5 text-center text-gray-600 dark:text-gray-400 font-medium">
                          {product.sku ?? "-"}
                        </td>
                        <td className="px-3 py-2.5 text-center text-gray-600 dark:text-gray-400 font-mono text-xs">
                          {product.custom_barcode ?? "-"}
                        </td>
                        <td className="px-3 py-2.5 text-right text-gray-700 dark:text-gray-300">
                          ৳ {(product.purchase_price || 0).toLocaleString()}
                        </td>
                        <td className="px-3 py-2.5 text-right text-gray-700 dark:text-gray-300">
                          ৳ {(product.sales_price || 0).toLocaleString()}
                        </td>
                        <td className="px-3 py-2.5 text-center text-gray-700 dark:text-gray-300 font-medium">
                          {product.stock || 0}
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                          ৳ {totalAsset.toLocaleString()}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  <tr className="bg-blue-50 dark:bg-blue-950/20 text-sm font-bold border-t-2 border-blue-200 dark:border-blue-800 h-14">
                    <td colSpan={5} className="px-4 text-base text-blue-700 dark:text-blue-400">
                      Total ({products.length} Products):
                    </td>
                    <td className="px-3 text-right text-blue-800 dark:text-blue-300">
                      ৳ {products.reduce((sum, p) => sum + (p.purchase_price || 0), 0).toLocaleString()}
                    </td>
                    <td className="px-3 text-right text-blue-800 dark:text-blue-300">
                      ৳ {products.reduce((sum, p) => sum + (p.sales_price || 0), 0).toLocaleString()}
                    </td>
                    <td className="px-3 text-center text-blue-800 dark:text-blue-300">
                      {totalStock}
                    </td>
                    <td className="px-3 text-right text-emerald-700 dark:text-emerald-400 font-extrabold text-base">
                      ৳ {totalPurchaseValue.toLocaleString()}
                    </td>
                    <td className="px-3"></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </Card>
  );
}
