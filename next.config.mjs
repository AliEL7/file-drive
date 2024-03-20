/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "https://whimsical-alpaca-68.convex.cloud",
            }
        ]
    }
};

export default nextConfig;
