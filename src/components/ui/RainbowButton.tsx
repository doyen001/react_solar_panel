import Link from "next/link";
import classNames from "classnames";

const RAINBOW_GRADIENT =
  "conic-gradient(from 0deg, #FFEF62, #6BD6FF, #6BFF78, #BF61FF, #E7D95D, #FFEF62)";

const SHAPE_CLASS: Record<"pill" | "rounded", string> = {
  pill: "rounded-full",
  rounded: "rounded-xl",
};

type RainbowButtonProps = {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  shape?: "pill" | "rounded";
  /** Controls the inner surface: background, text color, padding, font size, etc. */
  className?: string;
  children: React.ReactNode;
};

/**
 * A spinning conic-gradient ring wrapping an opaque inner surface — the ring
 * shows only through a 1.5px gap, so it reads as an animated gradient border.
 */
export function RainbowButton({
  href,
  onClick,
  type = "button",
  shape = "pill",
  className,
  children,
}: RainbowButtonProps) {
  const shapeClass = SHAPE_CLASS[shape];
  const wrapperClass = classNames(
    "group relative inline-flex overflow-hidden p-[1.5px] shadow-sm",
    shapeClass,
  );

  const inner = (
    <>
      <span
        aria-hidden
        className="absolute inset-[-80%] motion-reduce:animate-none [animation:rainbow-trace-spin_5s_linear_infinite]"
        style={{ backgroundImage: RAINBOW_GRADIENT }}
      />
      <span
        className={classNames(
          "relative inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors",
          shapeClass,
          className,
        )}
      >
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={wrapperClass}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={wrapperClass}>
      {inner}
    </button>
  );
}
