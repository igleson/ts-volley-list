import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import { shadesOfPurple } from "@clerk/themes";
import { TopNav } from "~/components/ui/topnav";
import { Toaster } from "sonner";
import React from "react";

export const metadata: Metadata = {
  title: "Gerenciador de listas",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{ children: React.ReactNode }>) {
  return (
      <ClerkProvider
          appearance={{
            baseTheme: [shadesOfPurple],
          }}
      >
        <html lang="en" className={`${GeistSans.variable}`}>
        <body>
        <TopNav />
        {children}
        <Toaster
            position="bottom-center"
            closeButton={true}
            richColors={true}
            theme="dark"
        />
        </body>
        </html>
      </ClerkProvider>
  );
}