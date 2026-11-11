import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "NekoMeow | Crypto Awareness Project",
  description:
    "NekoMeow is a community-driven crypto awareness project focused on education, adoption, and building a utility-driven ecosystem on the BNB Chain.",
  keywords: [
    "NekoMeow",
    "Crypto",
    "BNB Chain",
    "Web3",
    "DeFi",
    "Crypto Awareness",
  ],
  openGraph: {
    title: "NekoMeow Crypto Project",
    description:
      "A community-driven crypto awareness and utility-focused ecosystem.",
    url: "https://nekomeow.com",
    siteName: "NekoMeow",
    images: [
      {
        url: "/images/nekomeow-logo.jpg",
        width: 1200,
        height: 630,
        alt: "NekoMeow Logo",
      },
    ],
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}