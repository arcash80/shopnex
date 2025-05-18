import type { Metadata } from "next";

import "./globals.css";

import type React from "react";

import { Providers } from "./_providers/providers";

export const metadata: Metadata = {
  description: "A blank template using Payload in a Next.js.",
  title: "Shopnex Payload - Next.js",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html data-mode="light" lang="en">
      <body>
        <Providers>
          <main className="relative">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
