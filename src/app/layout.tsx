import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '개미굴 가이드 :: AI 여행 스케줄링',
  description: '개미굴 가이드 :: AI 여행 스케줄링',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header/>
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  )
}
