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
          colorBackground: "#121212",
          colorText: "white",
          colorInputBackground: "rgba(255, 255, 255, 0.1)",
          colorInputText: "white",
          colorDanger: "#ef4444",
          colorSuccess: "#10b981",
          borderRadius: "1.25rem",
        },
        elements: {
          card: "bg-[#121212] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.95)] rounded-[2.5rem] p-4",
          headerTitle: "font-black uppercase tracking-widest text-white text-3xl mb-2",
          headerSubtitle: "text-zinc-400 font-medium tracking-normal mb-10",
          socialButtonsBlockButton: "border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all py-4 rounded-2xl",
          formButtonPrimary: "bg-[#FF385C] hover:bg-[#FF385C]/90 text-white font-black uppercase tracking-widest text-[11px] py-4 shadow-[0_0_30px_rgba(255,56,92,0.4)] transition-all rounded-2xl mt-4",
          formFieldInput: "bg-white/5 border border-white/10 focus:border-[#FF385C]/50 transition-colors text-sm py-4 rounded-xl px-5",
          formFieldLabel: "text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px] mb-3 block opacity-80",
          footerActionLink: "text-[#FF385C] hover:text-[#FF385C]/80 font-black uppercase tracking-widest text-[10px] ml-2",
          identityPreviewText: "text-zinc-200 font-bold",
          identityPreviewEditButton: "text-[#FF385C] hover:text-[#FF385C]/80",
          userButtonAvatarBox: "w-11 h-11 border border-white/10 shadow-xl",
          userButtonPopoverCard: "bg-[#121212] border border-white/10 shadow-2xl rounded-3xl",
        }
      }}
    >
      <html
        lang="es"
        className={`${inter.variable} ${outfit.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col" suppressHydrationWarning>
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
