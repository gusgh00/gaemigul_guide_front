/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    async rewrites() {
        return [
            {
                source: `/api/:path*`,
                destination: `/api/:path*`,
            },
        ];
    },
}

module.exports = nextConfig
