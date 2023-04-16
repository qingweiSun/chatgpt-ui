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
        <link rel="shortcut icon" href="favicon.svg" />
        <meta name="theme-color" content="#0072f5" />
        <meta
          name="keywords"
          content="HTML5, CSS3, JavaScript, TypeScript, Vue, React, 前端, 个人博客"
        />

        <meta name="author" content="author" />

        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />

        <meta name="theme-color" content="#6768ab" />

        <link rel="manifest" href="/manifest.json" />

        <link href="/icon-mac.png" rel="icon" type="image/png" sizes="16x16" />

        <link rel="apple-touch-icon" href="/favicon.svg"></link>
        <title>Welcome use AI.</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
