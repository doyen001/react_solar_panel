/**
 * Writes public/templates/customer-import-template.xlsx
 * Run: npm run generate:customer-import-template
 *
 * Column headers and copy stay in sync with
 * src/lib/installers/customer-import/template.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import xlsx from "xlsx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const outDir = path.join(projectRoot, "public", "templates");
const outFile = path.join(outDir, "customer-import-template.xlsx");

const SHEET_CUSTOMERS = "Customers";
const SHEET_INSTRUCTIONS = "Instructions";

const HEADERS = ["email", "first_name", "last_name", "phone", "address"];

const SAMPLE_ROW = {
  email: "jane.smith@example.com",
  first_name: "Jane",
  last_name: "Smith",
  phone: "0412 345 678",
  address: "12 Solar St, Sydney NSW 2000",
};

const INSTRUCTION_LINES = [
  "Customer import template",
  "",
  "1. Fill one row per customer on the Customers sheet.",
  "2. Do not rename or reorder the header row (email, first_name, last_name, phone, address).",
  "3. Required columns: email, first_name, last_name.",
  "4. Optional columns: phone, address.",
  "",
  "Email",
  "  • Must be a valid address and unique in the platform.",
  "  • Duplicate emails in your file or already registered are skipped on import.",
  "",
  "Phone (Australia)",
  "  • Examples: 0412 345 678, +61 412 345 678, (02) 9123 4567",
  "  • Leave blank if unknown.",
  "",
  "Google Sheets",
  "  • File → Download → Microsoft Excel (.xlsx) or Comma-separated values (.csv), then upload in the installer portal.",
  "",
  "Delete the sample row before importing your real customers.",
];

const workbook = xlsx.utils.book_new();

const customersAoa = [
  HEADERS,
  HEADERS.map((h) => SAMPLE_ROW[h] ?? ""),
];
const customersSheet = xlsx.utils.aoa_to_sheet(customersAoa);
customersSheet["!cols"] = [
  { wch: 32 },
  { wch: 14 },
  { wch: 14 },
  { wch: 18 },
  { wch: 40 },
];
xlsx.utils.book_append_sheet(workbook, customersSheet, SHEET_CUSTOMERS);

const instructionsAoa = INSTRUCTION_LINES.map((line) => [line]);
const instructionsSheet = xlsx.utils.aoa_to_sheet(instructionsAoa);
instructionsSheet["!cols"] = [{ wch: 88 }];
xlsx.utils.book_append_sheet(workbook, instructionsSheet, SHEET_INSTRUCTIONS);

fs.mkdirSync(outDir, { recursive: true });
xlsx.writeFile(workbook, outFile);

console.log(`Wrote ${path.relative(projectRoot, outFile)}`);
