import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { useState } from "react";

import { shadesOfPurple } from "@clerk/themes";
import { TopNav } from "~/components/ui/topnav";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Gerenciador de listas",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{ children: React.ReactNode }>) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
      <ClerkProvider
          appearance={{
            baseTheme: [shadesOfPurple],
          }}
      >
        <html lang="en" className={`${GeistSans.variable}`}>
        <body>
        <TopNav />
        <button
            onClick={toggleSidebar}
            className="fixed top-4 left-4 bg-purple-950 text-white p-2 rounded z-50"
        >
          {isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        </button>
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