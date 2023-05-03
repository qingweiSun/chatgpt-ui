import "./globals.css";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        <link rel="shortcut icon" href="/bot.svg" />
        <link rel="manifest" href="/manifest.json" />
        <link href="/bot.svg" rel="icon" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/bot.svg"></link>
        <title>Welcome use AI.</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
        ></meta>
      </head>
      <body>{children}</body>
    </html>
  );
}
