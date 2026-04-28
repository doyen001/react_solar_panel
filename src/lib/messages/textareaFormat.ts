/** Markdown helpers for the message textarea (selection-aware). */

import { normalizeMarkdownUrl } from "./href";

export type EditResult = {
  value: string;
  /** Caret position after edit (selection collapsed). */
  caret: number;
  /** Optional selection range after edit. */
  selection?: { start: number; end: number };
};

function merge(
  value: string,
  start: number,
  end: number,
  insertion: string,
): { value: string; caret: number } {
  const next = value.slice(0, start) + insertion + value.slice(end);
  const caret = start + insertion.length;
  return { value: next, caret };
}

/** Wrap selection with markers (e.g. **bold**). Empty selection places caret between markers. */
const BOLD = "**";
const BOLD_LEN = 2;

/** Toggle bold: unwrap if already bold, otherwise wrap with **. */
export function toggleBold(value: string, start: number, end: number): EditResult {
  const sel = value.slice(start, end);

  if (sel.startsWith(BOLD) && sel.endsWith(BOLD) && sel.length >= 4) {
    const inner = sel.slice(BOLD_LEN, -BOLD_LEN);
    const next = value.slice(0, start) + inner + value.slice(end);
    return {
      value: next,
      caret: start + inner.length,
      selection: { start, end: start + inner.length },
    };
  }

  const left = value.lastIndexOf(BOLD, start - 1);
  const right = value.indexOf(BOLD, end);
  if (
    left !== -1 &&
    right !== -1 &&
    left + BOLD_LEN <= start &&
    right >= end &&
    left < right
  ) {
    const innerRegion = value.slice(left + BOLD_LEN, right);
    if (!innerRegion.includes(BOLD)) {
      const next =
        value.slice(0, left) + innerRegion + value.slice(right + BOLD_LEN);
      const newStart = start - BOLD_LEN;
      const newEnd = end - BOLD_LEN;
      return {
        value: next,
        caret: newStart,
        selection: { start: newStart, end: newEnd },
      };
    }
  }

  if (start === end) {
    const pos = start;
    const leftB = value.lastIndexOf(BOLD, pos - 1);
    const rightB = value.indexOf(BOLD, pos);
    if (
      leftB !== -1 &&
      rightB !== -1 &&
      pos >= leftB + BOLD_LEN &&
      pos < rightB
    ) {
      const inner = value.slice(leftB + BOLD_LEN, rightB);
      if (!inner.includes(BOLD)) {
        const next =
          value.slice(0, leftB) + inner + value.slice(rightB + BOLD_LEN);
        const newPos = leftB + (pos - leftB - BOLD_LEN);
        return { value: next, caret: newPos };
      }
    }
  }

  return wrapMarkers(value, start, end, BOLD, BOLD);
}

const IT = "_";
const IT_LEN = 1;

/** Toggle italic: unwrap if inside _ ... _, otherwise wrap with _. */
export function toggleItalic(value: string, start: number, end: number): EditResult {
  const sel = value.slice(start, end);

  if (sel.startsWith(IT) && sel.endsWith(IT) && sel.length >= 3) {
    const inner = sel.slice(1, -1);
    const next = value.slice(0, start) + inner + value.slice(end);
    return {
      value: next,
      caret: start + inner.length,
      selection: { start, end: start + inner.length },
    };
  }

  const left = value.lastIndexOf(IT, start - 1);
  const right = value.indexOf(IT, end);
  if (
    left !== -1 &&
    right !== -1 &&
    left + IT_LEN <= start &&
    right >= end &&
    left < right
  ) {
    const innerRegion = value.slice(left + IT_LEN, right);
    if (!innerRegion.includes(IT)) {
      const next =
        value.slice(0, left) + innerRegion + value.slice(right + IT_LEN);
      const newStart = start - IT_LEN;
      const newEnd = end - IT_LEN;
      return {
        value: next,
        caret: newStart,
        selection: { start: newStart, end: newEnd },
      };
    }
  }

  if (start === end) {
    const pos = start;
    const leftI = value.lastIndexOf(IT, pos - 1);
    const rightI = value.indexOf(IT, pos);
    if (
      leftI !== -1 &&
      rightI !== -1 &&
      pos > leftI &&
      pos < rightI
    ) {
      const inner = value.slice(leftI + IT_LEN, rightI);
      if (!inner.includes(IT)) {
        const next =
          value.slice(0, leftI) + inner + value.slice(rightI + IT_LEN);
        const newPos = leftI + (pos - leftI - IT_LEN);
        return { value: next, caret: newPos };
      }
    }
  }

  return wrapMarkers(value, start, end, IT, IT);
}

export function wrapMarkers(
  value: string,
  start: number,
  end: number,
  open: string,
  close: string,
): EditResult {
  const selected = value.slice(start, end);
  if (selected.length === 0) {
    const insertion = `${open}${close}`;
    const { value: next, caret } = merge(value, start, end, insertion);
    return {
      value: next,
      caret: start + open.length,
      selection: { start: start + open.length, end: start + open.length },
    };
  }
  const insertion = `${open}${selected}${close}`;
  const { value: next, caret } = merge(value, start, end, insertion);
  return {
    value: next,
    caret,
    selection: {
      start: start + open.length,
      end: start + open.length + selected.length,
    },
  };
}

export function insertLink(
  value: string,
  start: number,
  end: number,
  url: string,
): EditResult {
  const trimmedUrl = normalizeMarkdownUrl(url.trim());
  const selected = value.slice(start, end);
  const label = selected.trim() ? selected : "link";
  const md = `[${label}](${trimmedUrl})`;
  const { value: next, caret } = merge(value, start, end, md);
  return { value: next, caret };
}

export function insertImageMarkdown(
  value: string,
  start: number,
  end: number,
  url: string,
  alt: string,
): EditResult {
  const md = `![${alt || "image"}](${url})`;
  const { value: next, caret } = merge(value, start, end, md);
  return { value: next, caret };
}

export function insertAttachmentMarkdown(
  value: string,
  start: number,
  end: number,
  url: string,
  filename: string,
): EditResult {
  const md = `[${filename}](${url})`;
  const { value: next, caret } = merge(value, start, end, md);
  return { value: next, caret };
}

export function insertText(value: string, start: number, end: number, text: string): EditResult {
  const { value: next, caret } = merge(value, start, end, text);
  return { value: next, caret };
}
