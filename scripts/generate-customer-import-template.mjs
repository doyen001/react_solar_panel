/**
 * Writes public/templates/customer-import-template.xlsx
 * Run: npm run generate:customer-import-template
 *
 * Columns, sample row and instruction copy are read straight from
 * src/lib/installers/customer-import/template.ts, so the generated workbook
 * can never drift from what the parser accepts.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import xlsx from "xlsx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const outDir = path.join(projectRoot, "public", "templates");
const outFile = path.join(outDir, "customer-import-template.xlsx");

const templateModule = path.join(
  projectRoot,
  "src",
  "lib",
  "installers",
  "customer-import",
  "template.ts",
);

/**
 * template.ts is plain TypeScript with no runtime imports, so the literals can
 * be lifted out without a build step. Kept narrow on purpose: only the three
 * exports this script needs.
 */
const source = fs.readFileSync(templateModule, "utf8");

function extractArrayLiteral(name) {
  const start = source.indexOf(`export const ${name}`);
  if (start < 0) throw new Error(`Could not find ${name} in template.ts`);
  // Skip past the type annotation, whose `Foo[]` would otherwise match first.
  const assign = source.indexOf("=", start);
  const open = source.indexOf("[", assign);
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === "[") depth += 1;
    if (source[i] === "]") {
      depth -= 1;
      if (depth === 0) return source.slice(open, i + 1);
    }
  }
  throw new Error(`Unterminated array for ${name}`);
}

function extractObjectLiteral(name) {
  const start = source.indexOf(`export const ${name}`);
  if (start < 0) throw new Error(`Could not find ${name} in template.ts`);
  const assign = source.indexOf("=", start);
  const open = source.indexOf("{", assign);
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(open, i + 1);
    }
  }
  throw new Error(`Unterminated object for ${name}`);
}

function evaluate(literal) {
  return new Function(`return (${literal.replace(/\bas const\b/g, "")});`)();
}

const COLUMNS = evaluate(
  extractArrayLiteral("CUSTOMER_IMPORT_TEMPLATE_COLUMNS"),
);
const SAMPLE_ROW = evaluate(extractObjectLiteral("CUSTOMER_IMPORT_SAMPLE_ROW"));
const INSTRUCTION_LINES = evaluate(
  extractArrayLiteral("CUSTOMER_IMPORT_INSTRUCTIONS"),
);

const SHEET_CUSTOMERS = "Customers";
const SHEET_INSTRUCTIONS = "Instructions";

const headers = COLUMNS.map((c) => c.header);

const workbook = xlsx.utils.book_new();

const customersSheet = xlsx.utils.aoa_to_sheet([
  headers,
  headers.map((h) => SAMPLE_ROW[h] ?? ""),
]);
customersSheet["!cols"] = COLUMNS.map((c) => ({ wch: c.width }));
xlsx.utils.book_append_sheet(workbook, customersSheet, SHEET_CUSTOMERS);

const instructionsAoa = [
  ...INSTRUCTION_LINES.map((line) => [line]),
  [""],
  ["Columns"],
  ...COLUMNS.map((c) => [
    `  • ${c.header}${c.required ? " (required)" : ""} — ${c.description}`,
  ]),
];
const instructionsSheet = xlsx.utils.aoa_to_sheet(instructionsAoa);
instructionsSheet["!cols"] = [{ wch: 92 }];
xlsx.utils.book_append_sheet(workbook, instructionsSheet, SHEET_INSTRUCTIONS);

fs.mkdirSync(outDir, { recursive: true });
xlsx.writeFile(workbook, outFile);

console.log(
  `Wrote ${path.relative(projectRoot, outFile)} (${headers.length} columns)`,
);
