import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { I18nProvider } from "@/context/I18nContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aura Hospitality Suite | Advanced PMS & ERP",
  description: "The modern backbone for hotel management, designed for scalability and excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#FF385C",
          colorBackground: "#050505",
          colorText: "white",
          colorInputBackground: "rgba(255, 255, 255, 0.05)",
          colorInputText: "white",
          colorDanger: "#ef4444",
          colorSuccess: "#10b981",
          borderRadius: "1rem",
        },
        elements: {
          card: "bg-[#0A0A0A] border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.8)] rounded-3xl",
          headerTitle: "font-black uppercase tracking-widest text-white text-2xl",
          headerSubtitle: "text-zinc-500 font-medium",
          socialButtonsBlockButton: "border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all",
          formButtonPrimary: "bg-[#FF385C] hover:bg-[#FF385C]/90 text-white font-black uppercase tracking-widest text-[10px] py-3 shadow-[0_0_20px_rgba(255,56,92,0.3)] transition-all",
          formFieldInput: "bg-white/5 border border-white/10 focus:border-[#FF385C]/50 transition-colors text-sm py-3",
          formFieldLabel: "text-zinc-400 font-bold uppercase tracking-widest text-[9px]",
          footerActionLink: "text-[#FF385C] hover:text-[#FF385C]/80 font-bold",
          identityPreviewEditButton: "text-[#FF385C] hover:text-[#FF385C]/80",
          userButtonAvatarBox: "w-10 h-10 border border-white/10 shadow-lg",
          userButtonPopoverCard: "bg-[#0A0A0A] border border-white/5 shadow-2xl",
        }
      }}
    >
      <html
        lang="es"
        className={`${inter.variable} ${outfit.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <I18nProvider>
              {children}
            </I18nProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
