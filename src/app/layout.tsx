import './globals.css'
import type { Metadata } from 'next'
import Header from "@/app/_components/header";
import React from "react";
import Script from "next/script";
import GoogleAnalytics from "@module/GoogleAnalytics";

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: '개미굴 가이드 :: 여행 스케줄링',
    description: '개미굴 가이드를 통해 자유롭게 여행을 계획해보세요!',
    keywords: ['여행', '여행지도', '여행계획', '여행가이드', '여행스케줄'],
    icons: {
        icon: "/gaemigul_guide_logo_favicon.ico"
    },
    openGraph: {
        title: '개미굴 가이드 :: 여행 스케줄링',
        description: '개미굴 가이드를 통해 자유롭게 여행을 계획해보세요!',
        url: "https://gaemigul-guide.com",
        images: [
            {
                url: "https://raw.githubusercontent.com/gusgh00/gaemigul_guide_img/refs/heads/main/gaemigul_guide_og_image.png",
                width: "1200",
                height: "630",
                alt: "gaemigul_guide_og"
            }
        ],
        locale: "ko_KR"
    },
    creator: "Ryu HYNO",
    publisher: "Ryu HYNO",
    formatDetection: {
        email: true,
        address: false,
        telephone: false
    }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const API = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&libraries=services,clusterer&autoload=false`

  return (
        <html lang="en">
        <body>
        {/*GA 영역*/}
        {process.env.GA_TRACKING_ID ? (
            <GoogleAnalytics id={process.env.GA_TRACKING_ID}/>
        ) : null}
        {/*GA 영역*/}
        <Script
            src={API}
            strategy="beforeInteractive"
        />
        <Header/>
        <main>
            {children}
        </main>
        </body>
        </html>
  )
}
