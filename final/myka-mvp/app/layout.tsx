// app/layout.tsx
import './globals.css';
import React from 'react';
import type { ReactNode } from 'react';

export const metadata = {
  title: "Myka’s Path",
  description:
    "A magical personal-growth PWA for Myka: emotion-driven quotes, daily hacks, career suggestions & AI-powered goal planning.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Character encoding & responsive meta */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Enchanted fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Raleway:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
