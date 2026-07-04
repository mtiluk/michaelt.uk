import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  async headers() {
    return [
      {
        source: "/giscus-theme.css",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://giscus.app" },
        ],
      },

    ];
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
