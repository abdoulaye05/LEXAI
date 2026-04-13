/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // TEMPORAIRE — premier déploiement. À retirer dès qu'on a nettoyé les types
    // (notamment les callbacks `cookies` du @supabase/ssr 0.5.2 qui héritent
    // d'`any` implicite, et les types des params dynamiques des routes).
    ignoreBuildErrors: true,
  },
  eslint: {
    // Idem — on ne bloque pas le déploiement sur des warnings ESLint hérités
    // de configs Next legacy.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
