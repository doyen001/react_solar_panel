type ReadingColumnLayoutProps = {
  children: React.ReactNode;
  /** Page background token class, e.g. bg-user-manual-page-bg */
  backgroundClassName: string;
};

/**
 * Centers a readable column with responsive horizontal padding (marketing / legal text).
 */
export function ReadingColumnLayout({
  children,
  backgroundClassName,
}: ReadingColumnLayoutProps) {
  return (
    <div className={backgroundClassName}>
      <div className="mx-auto w-full max-w-[720px] px-6 lg:px-0">
        {children}
      </div>
    </div>
  );
}
