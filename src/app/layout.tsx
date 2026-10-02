import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { MainLayoutShell } from "@/components/MainLayoutShell";
import { SmoothScroll } from "@/components/SmoothScroll";
import { TabBlinker } from "@/components/TabBlinker";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.thegravitystudios.com"),
  title: {
    default: "The Gravity Studios — Content Systems Studio for Brands",
    template: "%s | The Gravity Studios",
  },
  description:
    "Official website of The Gravity Studios. We build the content systems that grow brands — strategy, campaign design, high-end production, and paid media management by one accountable team.",
  keywords: [
    "The Gravity Studios",
    "Gravity Studios",
    "The Gravity Studio",
    "Gravity Studio",
    "Gravity Content Systems",
    "Gravity Studios Production",
    "The Gravity Studios Website",
    "Gravity Studios Agency",
  ],
  authors: [{ name: "The Gravity Studios", url: "https://www.thegravitystudios.com" }],
  creator: "The Gravity Studios",
  publisher: "The Gravity Studios",
  alternates: {
    canonical: "https://www.thegravitystudios.com",
  },
  icons: {
    icon: [
      { url: "/favicon-withbg.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon-withbg.png",
    apple: "/favicon-withbg.png",
  },
  openGraph: {
    title: "The Gravity Studios — Content Systems Studio for Brands",
    description:
      "Official website of The Gravity Studios. Content systems, brand films, video production, strategy, and paid media management.",
    url: "https://www.thegravitystudios.com",
    siteName: "The Gravity Studios",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.thegravitystudios.com/favicon-nobg.png",
        width: 1200,
        height: 630,
        alt: "The Gravity Studios Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Gravity Studios — Content Systems Studio for Brands",
    description: "Official website of The Gravity Studios. Content systems, brand films, video production, and strategy.",
    images: ["https://www.thegravitystudios.com/favicon-nobg.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.thegravitystudios.com/#organization",
      "name": "The Gravity Studios",
      "alternateName": ["Gravity Studios", "The Gravity Studio", "Gravity Studio"],
      "url": "https://www.thegravitystudios.com",
      "logo": "https://www.thegravitystudios.com/favicon-nobg.png",
      "description":
        "The Gravity Studios is the premier Content Systems Studio for brands. We build strategy, campaign design, high-end video production, and paid media management.",
      "sameAs": [
        "https://www.instagram.com/thegravitystudios",
        "https://www.linkedin.com/company/thegravitystudios",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.thegravitystudios.com/#website",
      "url": "https://www.thegravitystudios.com",
      "name": "The Gravity Studios",
      "alternateName": ["Gravity Studios"],
      "publisher": { "@id": "https://www.thegravitystudios.com/#organization" },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        {/* Synchronous script to guarantee Light Mode by default */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('tgs-theme');
                  var theme = saved || 'light';
                  var d = document.documentElement;
                  d.classList.remove('light', 'dark');
                  d.classList.add(theme);
                  if (theme === 'light') {
                    d.style.backgroundColor = '#F4F5F8';
                    d.style.color = '#0F172A';
                  } else {
                    d.style.backgroundColor = '#0B0C10';
                    d.style.color = '#F8FAFC';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* JSON-LD Schema.org Structured Data for Search Engine Authority */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)]">
        <ThemeProvider>
          <ToastProvider>
            <TabBlinker />
            <SmoothScroll />
            <MainLayoutShell>{children}</MainLayoutShell>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
