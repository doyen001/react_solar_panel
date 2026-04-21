/** Icons shared by installer dashboard home, tags, tasks, shortcut rail */

export function IconCheckSquare({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 12.5l2.2 2.2L16.2 9" />
    </svg>
  );
}

export function IconPanelPlus({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconPanelTag({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12.586 3.586A2 2 0 0011.314 3H5a2 2 0 00-2 2v6.314a2 2 0 00.586 1.414l8.586 8.586a2 2 0 002.828 0l6.172-6.172a2 2 0 000-2.828l-8.586-8.586z" />
      <circle cx="9.75" cy="9.75" r="1.25" fill="currentColor" />
    </svg>
  );
}
