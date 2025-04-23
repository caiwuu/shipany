import type { ReactElement } from "react";

declare module "*.mdx" {
  const content: (props: any) => ReactElement;
  export default content;
}
