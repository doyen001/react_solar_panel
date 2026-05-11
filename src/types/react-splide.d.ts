declare module "@splidejs/react-splide" {
  import * as React from "react";
  import type { Options } from "@splidejs/splide";

  export interface SplideProps {
    options?: Options;
    className?: string;
    children?: React.ReactNode;
    hasTrack?: boolean;
    tag?: keyof React.JSX.IntrinsicElements;
    "aria-label"?: string;
  }

  export class Splide extends React.Component<SplideProps> {}

  export const SplideSlide: React.FC<{
    className?: string;
    children?: React.ReactNode;
  }>;
}

declare module "@splidejs/react-splide/css";
