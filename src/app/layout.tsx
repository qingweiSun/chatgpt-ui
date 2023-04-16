import "./globals.css";
import React from "react";
import Head from "next/head";

export const metadata = {
  title: "Welcome use AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <Head>
        <title>Welcome use AI.</title>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="theme-color" content="#6768ab" />
        <link rel="manifest" href="/manifest.json" />
        {/*配置favicon*/}
        <link rel="icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg"></link>
      </Head>

      <body>{children}</body>
    </html>
  );
}
