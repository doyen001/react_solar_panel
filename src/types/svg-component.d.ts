declare module "*.svg?component" {
  import * as React from "react";
  const Component: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export default Component;
}
