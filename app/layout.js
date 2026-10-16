import "./globals.css";
import "./effects.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Backdrop from "@/components/Backdrop";
import CardGlow from "@/components/CardGlow";
import ReadingProgress from "@/components/ReadingProgress";
import Analytics from "@/components/Analytics";
import { site } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: `Adam Ho | Projects`, template: `%s | Adam Ho` },
  description: site.description,
  icons: { icon: "/images/favicon.png", apple: "/images/app-icon.png" },
  openGraph: { title: site.name, description: site.description, type: "website" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Unbounded:wght@300;400;500&display=swap"
        />
      </head>
      <body>
        <Backdrop />
        <Analytics />
        <ReadingProgress />
        <CardGlow />
        <a href="#main" className="skip">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
