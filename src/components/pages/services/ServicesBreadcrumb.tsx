import Link from "next/link";

import { SERVICES_PAGE } from "@/utils/constant";

export function ServicesBreadcrumb() {
  const trail = SERVICES_PAGE.breadcrumb;

  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-inter text-[13px] leading-5 text-svc-dark-muted">
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;

          return (
            <li key={crumb.label} className="flex items-center gap-2">
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="svc-focusable-dark rounded-sm transition hover:text-white"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current="page" className="font-medium text-svc-dark-body">
                  {crumb.label}
                </span>
              )}
              {isLast ? null : (
                <span aria-hidden="true" className="text-white/25">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
