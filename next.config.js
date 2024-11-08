/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    trailingSlash: true,
    output: "export",
    distDir: 'dist',
    async rewrites() {
        return [
            {
                source: `/api/:path*`,
                destination: `/api/:path*`,
            },
        ];
    },
    assetPrefix:
        process.env.NODE_ENV === "production"
            ? "https://github.com/gusgh00/gaemigul_guide_front"
            : "",
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh5.googleusercontent.com', // 이 부분을 수정
                port: '', // 필요 없으면 빈 문자열
                pathname: '/**', // 필요한 경우 세부 경로를 추가
            },
        ],
    },
}

module.exports = nextConfig
