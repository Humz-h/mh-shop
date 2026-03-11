import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./css/euclid-circular-a-font.css";
import "./css/style.css";
import Header from "@/components/Header/index";
import Footer from "@/components/Footer/index";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/QuickViewModalContext";
import { CartModalProvider } from "./context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "./context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import ScrollToTop from "@/components/Common/ScrollToTop";
import ChatSupportWidget from "@/components/Common/ChatSupportWidget";
import { CartLoader } from "@/components/Cart/CartLoader";
import PopupBanner from "@/components/Banner/PopupBanner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MH STORE - Cửa hàng điện tử uy tín",
  description: "Cửa hàng điện tử với các sản phẩm chất lượng cao",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          <AuthProvider>
          <CartModalProvider>
            <ModalProvider>
              <PreviewSliderProvider>
                <CartLoader />
                <Header />
                {children}
                <QuickViewModal />
                <CartSidebarModal />
                <PreviewSliderModal />
                <PopupBanner />
              </PreviewSliderProvider>
            </ModalProvider>
          </CartModalProvider>
          </AuthProvider>
        </ReduxProvider>
        <ScrollToTop />
        <ChatSupportWidget />
        <Footer />
      </body>
    </html>
  )
}
