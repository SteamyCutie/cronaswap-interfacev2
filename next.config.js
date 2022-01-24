const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

const linguiConfig = require('./lingui.config.js')

const { locales, sourceLocale } = linguiConfig

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  webpack: (config) => {
    config.module.rules = [
      ...config.module.rules,
      {
        resourceQuery: /raw-lingui/,
        type: 'javascript/auto',
      },
    ]

    return config
  },
  experimental: { esmExternals: true },
  pwa: {
    dest: 'public',
    runtimeCaching,
    disable: process.env.NODE_ENV === 'development',
  },
  images: {
    domains: ['assets.sushi.com', 'res.cloudinary.com', 'raw.githubusercontent.com', 'logos.covalenthq.com'],
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/bridge',
        destination: '/swap',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/farm',
        destination: '/yield',
      },
      {
        source: '/stake',
        destination: '/stake',
      },
      {
        source: '/boost',
        destination: '/boost',
      },
      {
        source: '/zap',
        destination: '/exchange/zap',
      },
      {
        source: '/add/:token*',
        destination: '/exchange/add/:token*',
      },
      {
        source: '/remove/:token*',
        destination: '/exchange/remove/:token*',
      },
      {
        source: '/create/:token*',
        destination: '/exchange/add/:token*',
      },
      {
        source: '/swap',
        destination: '/exchange/swap',
      },
      {
        source: '/swap/:token*',
        destination: '/exchange/swap/:token*',
      },
      {
        source: '/migrate',
        destination: '/exchange/migrate',
      },
      {
        source: '/pool',
        destination: '/exchange/pool',
      },
      {
        source: '/find',
        destination: '/exchange/find',
      },
    ]
  },
  i18n: {
    localeDetection: true,
    locales,
    defaultLocale: sourceLocale,
  },
}

module.exports = withBundleAnalyzer(withPWA(nextConfig))

// Don't delete this console log, useful to see the config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2))
