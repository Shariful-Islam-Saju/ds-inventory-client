"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { TProduct } from "@/types";
import { format } from "date-fns";

type PropsType = {
  products: TProduct[];
};

const ProductExcelExport = ({ products }: PropsType) => {
  const todayDate = format(new Date(), "yyyy-MM-dd");

  const downloadExcel = async () => {
    if (products.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Products Report");

    // ✅ Define columns for Product Name, SKU, Custom Barcode, plus a Serial Number (SL)
    sheet.columns = [
      { header: "SL", key: "sl", width: 6 },
      { header: "Product Name", key: "name", width: 30 },
      { header: "SKU", key: "sku", width: 20 },
      { header: "Custom Barcode", key: "barcode", width: 20 },
    ];

    // 🔹 Title Row
    const title = `Products Report - ${todayDate}`;
    sheet.mergeCells("A1", "D1");
    const titleCell = sheet.getCell("A1");
    titleCell.value = title;
    titleCell.font = { size: 15, bold: true };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    sheet.getRow(1).height = 28;

    // ✅ Add header row
    const headerRow = sheet.addRow([
      "SL",
      "Product Name",
      "SKU",
      "Custom Barcode",
    ]);
    headerRow.height = 24;

    // 🔹 Style header row
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1E3A8A" }, // Indigo/Blue
      };
      cell.font = { color: { argb: "FFFFFF" }, bold: true, size: 11 };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // 🔹 Data Rows
    products.forEach((product, index) => {
      const row = sheet.addRow({
        sl: index + 1,
        name: product.item_name ?? "Unnamed",
        sku: product.sku ?? "-",
        barcode: product.custom_barcode ?? "-",
      });

      row.height = 22;
      row.eachCell((cell, colNumber) => {
        cell.alignment = {
          horizontal: colNumber === 2 ? "left" : "center", // Product Name is left-aligned
          vertical: "middle",
        };
        cell.font = { size: 10 };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        // Alternating row colors
        if (index % 2 === 0) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "F9FAFB" }, // Very light grey
          };
        } else {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "F3F4F6" }, // Light grey
          };
        }
      });
    });

    // ✅ Auto-adjust column widths
    sheet.columns.forEach((column) => {
      let maxLength = column.header?.toString().length ?? 10;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const val = cell.value ? cell.value.toString() : "";
        maxLength = Math.max(maxLength, val.length);
      });
      column.width = Math.min(Math.max(maxLength + 3, 6), 35);
    });

    // 🔹 Export file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Products_Report_${todayDate}.xlsx`);
  };

  return (
    <Button
      onClick={downloadExcel}
      className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-2 shadow-sm rounded-xl px-4 h-10 transition-colors duration-200"
    >
      📄 Download Excel
    </Button>
  );
};

export default ProductExcelExport;
