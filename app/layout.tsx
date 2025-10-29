import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "MotoZoop",
    template: "%s | MotoZoop",
  },
  description:
    "MotoZoop is a website for car accessories, your one-stop shop for all things automotive.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
