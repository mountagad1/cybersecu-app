import type { MetadataRoute } from "next";

/**
 * PWA manifest — Next.js serves this at /manifest.webmanifest and wires
 * the <link rel="manifest"> tag automatically. `display: "standalone"`
 * plus the icon set below is what makes "Add to Home Screen"/"Install
 * app" available on mobile.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "cybersecu.app — Apprendre, détecter, se protéger",
    short_name: "cybersecu",
    description:
      "Développez vos réflexes face aux arnaques et cyberattaques grâce à des simulations réalistes.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: "fr",
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/512-maskable", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
