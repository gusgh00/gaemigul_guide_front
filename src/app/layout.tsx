import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import React, {Suspense} from "react";
import Script from "next/script";

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '개미굴 가이드 :: AI 여행 스케줄링',
  description: '개미굴 가이드 :: AI 여행 스케줄링',
  icons: {
    icon: "/gaemigul_guide_logo_favicon.ico"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const API = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAO_CLIENT_ID}&libraries=services,clusterer&autoload=false`

  return (
        <html lang="en">
        <body>
        <Script
            src={API}
            strategy="beforeInteractive"
        />
        <Header/>
        <main>
            {children}
        </main>
        <Footer/>
        </body>
        </html>
  )
}
