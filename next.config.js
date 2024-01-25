/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
        dirs: ['/**/*']
    },
    env: {
        // NEXT AUTH
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_LOGIN_PATH: process.env.NEXTAUTH_LOGIN_PATH,
        // ENVIRONMENT
        ENVIRONMENT: process.env.ENVIRONMENT,
        // FIREBASE
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
        FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
        FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
        FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
        FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
        FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
        FIREBASE_GOOGLE_CLIENT_ID: process.env.FIREBASE_GOOGLE_CLIENT_ID,
        FIREBASE_GOOGLE_CLIENT_SECRET_KEY: process.env.FIREBASE_GOOGLE_CLIENT_SECRET_KEY,
        FIREBASE_GOOGLE_APPLICATION_CREDENTIALS: process.env.FIREBASE_GOOGLE_APPLICATION_CREDENTIALS,
        // MENSLEGIS API
        MENSLEGIS_API_URL: process.env.MENSLEGIS_API_URL,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
            }
        ]
    }
};

module.exports = nextConfig;
